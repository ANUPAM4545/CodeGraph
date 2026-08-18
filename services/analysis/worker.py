import sys
import os
import time
from datetime import datetime, timezone
import logging

# Add apps/api to path so we can import the DB models and config
api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../apps/api"))
sys.path.insert(0, api_path)

from src.db.session import SessionLocal
from src.db.models.job import AnalysisJob
from src.db.models.repository import RepositoryVersion
import urllib.parse
from rq import Queue
from redis import Redis

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

from services.analysis.domain.graph import CanonicalGraph
from services.analysis.parsers.python.parser import PythonParser
from services.analysis.parsers.python.extractor import PythonExtractor
from services.analysis.parsers.python.resolver import PythonResolver
from services.analysis.parsers.typescript.extractor import TypeScriptExtractor
from services.analysis.graph.neo4j import Neo4jGraphRepository
from services.analysis.source.github import GitHubSourceProvider
from src.services.security import GitHubTokenCipher
from src.db.models.user import ExternalIdentity
from src.db.models.repository import Repository
from src.core.config import settings

def run_analysis(job_id: str):
    db = SessionLocal()
    try:
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if not job:
            logging.error(f"Job {job_id} not found.")
            return

        logging.info(f"Starting analysis job {job_id} for repo {job.repository_id} (version: {job.repository_version_id})")
        
        job.status = "RUNNING"
        job.started_at = datetime.now(timezone.utc)
        db.commit()
        
        # Load associated models
        repo_version = db.query(RepositoryVersion).filter(RepositoryVersion.id == job.repository_version_id).first()
        if not repo_version:
            raise Exception(f"RepositoryVersion {job.repository_version_id} not found")

        repo = db.query(Repository).filter(Repository.id == job.repository_id).first()
        if not repo:
            raise Exception(f"Repository {job.repository_id} not found")

        identity = db.query(ExternalIdentity).filter(
            ExternalIdentity.user_id == repo.owner_id, 
            ExternalIdentity.provider == "github"
        ).first()

        token = None
        if identity and identity.encrypted_credentials:
            try:
                token = GitHubTokenCipher.decrypt(identity.encrypted_credentials)
            except Exception as e:
                logging.warning(f"Could not decrypt token: {e}")
        if not token and getattr(settings, "GITHUB_TOKEN", None):
            token = settings.GITHUB_TOKEN

        source_provider = GitHubSourceProvider(token=token, full_name=repo.full_name)
        
        # Commit hash from repo_version
        commit_sha = getattr(repo_version, "commit_sha", None) or getattr(repo_version, "commit_hash", "main")

        graph = CanonicalGraph(repository_version_id=str(repo_version.id))
        resolver = PythonResolver(version_id=str(repo_version.id))
        all_unresolved = {"calls": [], "imports": [], "inheritance": []}
        
        with source_provider.acquire_source(str(repo.id), commit_sha) as source_dir:
            files = source_provider.list_files(source_dir)
            logging.info(f"Found {len(files)} total files in source tree to analyze")
            
            # Directory Extraction
            from services.analysis.domain.nodes import GraphNode, IdentityGenerator
            from services.analysis.domain.relationships import GraphEdge, EdgeIdentityGenerator
            
            repo_version_node_id = IdentityGenerator.repo_version(str(repo_version.id))
            graph.nodes.append(GraphNode(
                id=repo_version_node_id,
                type="RepositoryVersion",
                repository_version_id=str(repo_version.id),
                name=commit_sha[:7] if commit_sha else "latest",
                qualified_name=commit_sha
            ))
            
            created_dirs = set()
            for file_path in files:
                rel_path = os.path.relpath(file_path, source_dir)
                dir_path = os.path.dirname(rel_path)
                
                # Build directory hierarchy
                current_dir = ""
                parts = dir_path.split(os.sep) if dir_path else []
                parent_id = repo_version_node_id
                
                for part in parts:
                    if not part:
                        continue
                    current_dir = os.path.join(current_dir, part) if current_dir else part
                    dir_id = IdentityGenerator.directory(str(repo_version.id), current_dir)
                    
                    if current_dir not in created_dirs:
                        graph.nodes.append(GraphNode(
                            id=dir_id,
                            type="Directory",
                            repository_version_id=str(repo_version.id),
                            name=part,
                            qualified_name=current_dir,
                            file_path=current_dir
                        ))
                        graph.edges.append(GraphEdge(
                            id=EdgeIdentityGenerator.edge_id(parent_id, dir_id, "CONTAINS"),
                            type="CONTAINS",
                            source_id=parent_id,
                            target_id=dir_id
                        ))
                        created_dirs.add(current_dir)
                    parent_id = dir_id
                    
                # Link file to its parent directory
                file_id = IdentityGenerator.file(str(repo_version.id), rel_path)
                
                # Add File node (if not added by AST extractors)
                if not any(n.id == file_id for n in graph.nodes):
                    graph.nodes.append(GraphNode(
                        id=file_id,
                        type="File",
                        repository_version_id=str(repo_version.id),
                        name=os.path.basename(rel_path),
                        qualified_name=rel_path,
                        file_path=rel_path
                    ))

                graph.edges.append(GraphEdge(
                    id=EdgeIdentityGenerator.edge_id(parent_id, file_id, "CONTAINS"),
                    type="CONTAINS",
                    source_id=parent_id,
                    target_id=file_id
                ))
            
            # Multi-Language AST & Package extraction
            py_parser = None
            try:
                py_parser = PythonParser()
            except Exception:
                pass

            for file_path in files:
                try:
                    with open(file_path, "rb") as f:
                        code_bytes = f.read()
                        
                    # Skip huge files (> 1MB)
                    if len(code_bytes) > 1024 * 1024:
                        continue
                        
                    rel_path = os.path.relpath(file_path, source_dir)
                    _, ext = os.path.splitext(rel_path)
                    ext_lower = ext.lower()

                    if ext_lower in {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"} or rel_path.endswith("package.json"):
                        ts_extractor = TypeScriptExtractor(str(repo_version.id), rel_path, code_bytes)
                        nodes, edges, unresolved = ts_extractor.extract()
                        
                        for n in nodes:
                            if not any(existing.id == n.id for existing in graph.nodes):
                                graph.nodes.append(n)
                        graph.edges.extend(edges)
                        all_unresolved["calls"].extend(unresolved["calls"])
                        all_unresolved["imports"].extend(unresolved["imports"])
                        all_unresolved["inheritance"].extend(unresolved["inheritance"])

                    elif ext_lower == ".py" and py_parser:
                        tree = py_parser.parse(code_bytes)
                        extractor = PythonExtractor(str(repo_version.id), rel_path, code_bytes)
                        nodes, edges, unresolved = extractor.extract(tree)
                        
                        for n in nodes:
                            if not any(existing.id == n.id for existing in graph.nodes):
                                graph.nodes.append(n)
                        graph.edges.extend(edges)
                        resolver.register_nodes(nodes)
                        
                        all_unresolved["calls"].extend(unresolved["calls"])
                        all_unresolved["imports"].extend(unresolved["imports"])
                        all_unresolved["inheritance"].extend(unresolved["inheritance"])
                        
                except Exception as e:
                    logging.warning(f"Failed to parse {file_path}: {e}")
                    
        # Resolution phase for Python if applicable
        try:
            resolver.resolve(all_unresolved)
            graph.nodes.extend(resolver.resolved_nodes)
            graph.edges.extend(resolver.resolved_edges)
        except Exception as e:
            logging.warning(f"Resolver phase notice: {e}")
        
        logging.info(f"Extracted {len(graph.nodes)} total canonical nodes and {len(graph.edges)} edges.")
        
        # Persistence to Neo4j
        graph_repo = Neo4jGraphRepository(
            uri=settings.NEO4J_URI,
            user=settings.NEO4J_USER,
            password=settings.NEO4J_PASSWORD
        )
        try:
            graph_repo.setup_constraints()
            graph_repo.save_graph(graph)
        finally:
            graph_repo.close()

        job.status = "COMPLETED"
        job.progress = 100.0
        job.completed_at = datetime.now(timezone.utc)
        repo_version.status = "completed"
        db.commit()
        logging.info(f"Job {job_id} completed successfully for version {repo_version.id}.")

    except Exception as e:
        logging.error(f"Job {job_id} failed: {e}")
        db.rollback()
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if job:
            job.status = "FAILED"
            job.error = str(e)
            job.completed_at = datetime.now(timezone.utc)
            
            version = db.query(RepositoryVersion).filter(RepositoryVersion.id == job.repository_version_id).first()
            if version:
                version.status = "failed"
                
            db.commit()
    finally:
        db.close()

execute_stateless_job = run_analysis
run_incremental_analysis = run_analysis

def run_semantic_indexing(job_id: str):
    db = SessionLocal()
    try:
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if not job:
            logging.error(f"Semantic Job {job_id} not found.")
            return

        logging.info(f"Starting semantic indexing job {job_id} for repo {job.repository_id} (version: {job.repository_version_id})")
        
        job.status = "RUNNING"
        job.started_at = datetime.now(timezone.utc)
        db.commit()
        
        repo_version = db.query(RepositoryVersion).filter(RepositoryVersion.id == job.repository_version_id).first()
        repo = db.query(Repository).filter(Repository.id == job.repository_id).first()
        identity = db.query(ExternalIdentity).filter(
            ExternalIdentity.user_id == repo.owner_id, 
            ExternalIdentity.provider == "github"
        ).first()

        token = GitHubTokenCipher.decrypt(identity.encrypted_credentials)
        source_provider = GitHubSourceProvider(token=token, full_name=repo.full_name)
        
        from services.analysis.vector.qdrant import QdrantVectorStore
        from services.analysis.vector.embeddings import get_embedding_provider
        from services.analysis.vector.chunking import extract_chunks_from_file, CodeChunk
        from services.analysis.vector.store import VectorPoint
        from services.analysis.graph.query import GraphQueryService
        
        embedding_provider = get_embedding_provider()
        vector_store = QdrantVectorStore()
        
        # Ensure collection exists
        collection_name = "codegraph_chunks"
        vector_store.ensure_collection(collection_name, embedding_provider.dimension)
        
        # Fetch canonical graph nodes that correspond to source symbols (Class, Function, Method)
        graph_service = GraphQueryService(
            uri=f"bolt://{settings.NEO4J_HOST}:{settings.NEO4J_PORT}",
            user=settings.NEO4J_USER,
            password=settings.NEO4J_PASSWORD
        )
        
        # We need a quick way to get nodes by file, but for now we get all valid types for this version
        # from neo4j and index them.
        subgraph = graph_service.get_subgraph(
            version_id=str(repo_version.id),
            node_types=["Class", "Function", "Method", "File"],
            limit=20000
        )
        graph_service.close()
        
        # Group canonical nodes by file
        nodes_by_file = {}
        for node in subgraph.nodes:
            metadata = node.metadata or {}
            fpath = metadata.get("file_path")
            if fpath:
                if fpath not in nodes_by_file:
                    nodes_by_file[fpath] = []
                nodes_by_file[fpath].append({
                    "id": node.id,
                    "type": node.type,
                    "name": node.label,
                    "qualified_name": metadata.get("qualified_name"),
                    "start_line": metadata.get("start_line", 1), # default 1 if not extracted properly, though our parser should have it
                    "end_line": metadata.get("end_line", 9999)
                })

        all_chunks: list[CodeChunk] = []
        
        with source_provider.acquire_source(str(repo.id), repo_version.commit_hash) as source_dir:
            for fpath, nodes in nodes_by_file.items():
                full_path = os.path.join(source_dir, fpath)
                if not os.path.exists(full_path):
                    continue
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        source_text = f.read()
                    
                    file_chunks = extract_chunks_from_file(
                        repository_id=str(repo.id),
                        repository_version_id=str(repo_version.id),
                        file_path=fpath,
                        source_text=source_text,
                        language="python",
                        canonical_nodes=nodes
                    )
                    all_chunks.extend(file_chunks)
                except UnicodeDecodeError:
                    pass # skip binary

        if all_chunks:
            # Batch embedding
            logging.info(f"Embedding {len(all_chunks)} chunks")
            texts = [c.content for c in all_chunks]
            embeddings = embedding_provider.embed_documents(texts)
            
            points = []
            for chunk, vec in zip(all_chunks, embeddings):
                points.append(VectorPoint(
                    id=chunk.id,
                    vector=vec,
                    payload=chunk.model_dump()
                ))
                
            # Idempotency / Stale Cleanup
            existing_ids = vector_store.get_existing_ids(collection_name, str(repo_version.id))
            new_ids = {p.id for p in points}
            stale_ids = [eid for eid in existing_ids if eid not in new_ids]
            
            vector_store.upsert(collection_name, points)
            
            if stale_ids:
                vector_store.delete_by_ids(collection_name, stale_ids, str(repo_version.id))
                
        job.status = "COMPLETED"
        job.progress = 100.0
        job.completed_at = datetime.now(timezone.utc)
        repo_version.status = "completed"
        db.commit()
        logging.info(f"Semantic Indexing Job {job_id} completed successfully.")

    except Exception as e:
        logging.error(f"Semantic Job {job_id} failed: {e}")
        db.rollback()
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if job:
            job.status = "FAILED"
            job.error = str(e)
            job.completed_at = datetime.now(timezone.utc)
            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    from redis import Redis
    from rq import Worker, Queue, Connection
    from src.core.config import settings
    
    redis_conn = Redis(host=settings.REDIS_HOST, port=int(settings.REDIS_PORT), db=0)
    
    with Connection(redis_conn):
        qs = ["analysis_tasks"]
        w = Worker(qs)
        logging.info("Starting analysis worker...")
        w.work()
