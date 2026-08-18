from typing import List, Optional, Dict, Any
from neo4j import GraphDatabase, Driver
from src.schemas.graph import (
    GraphDTO, GraphNodeDTO, GraphEdgeDTO, GraphOverviewDTO,
    NodeDetailDTO, NodeRelationshipDTO
)

ALLOWED_NODE_TYPES = {
    "RepositoryVersion", "Directory", "File", "Class", "Function", 
    "Method", "Variable", "Parameter", "ExternalPackage"
}
ALLOWED_REL_TYPES = {
    "CONTAINS", "DEFINES", "INHERITS", "HAS_PARAMETER", "CALLS", "IMPORTS"
}

class GraphQueryService:
    def __init__(self, uri: str, user: str, password: str):
        self.driver: Driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def get_overview(self, version_id: str) -> GraphOverviewDTO:
        query = """
        MATCH (n:GraphNode {repository_version_id: $version_id})
        WITH 
            count(n) AS total_nodes,
            sum(CASE WHEN n.type = 'Directory' THEN 1 ELSE 0 END) AS directories,
            sum(CASE WHEN n.type = 'File' THEN 1 ELSE 0 END) AS files,
            sum(CASE WHEN n.type = 'Class' THEN 1 ELSE 0 END) AS classes,
            sum(CASE WHEN n.type = 'Function' THEN 1 ELSE 0 END) AS functions,
            sum(CASE WHEN n.type = 'Method' THEN 1 ELSE 0 END) AS methods,
            sum(CASE WHEN n.type = 'Variable' THEN 1 ELSE 0 END) AS variables,
            sum(CASE WHEN n.type = 'Parameter' THEN 1 ELSE 0 END) AS parameters,
            sum(CASE WHEN n.type = 'ExternalPackage' THEN 1 ELSE 0 END) AS external_packages
            
        OPTIONAL MATCH (src:GraphNode {repository_version_id: $version_id})-[r]->(tgt:GraphNode {repository_version_id: $version_id})
        WITH total_nodes, directories, files, classes, functions, methods, variables, parameters, external_packages,
             count(r) AS total_edges,
             sum(CASE WHEN type(r) = 'IMPORTS' THEN 1 ELSE 0 END) AS imports,
             sum(CASE WHEN type(r) = 'CALLS' THEN 1 ELSE 0 END) AS calls,
             sum(CASE WHEN type(r) = 'INHERITS' THEN 1 ELSE 0 END) AS inheritance_relationships
             
        RETURN total_nodes, total_edges, directories, files, classes, functions, methods, 
               variables, parameters, external_packages, imports, calls, inheritance_relationships
        """
        with self.driver.session() as session:
            result = session.run(query, version_id=version_id).single()
            if not result:
                return GraphOverviewDTO(
                    repository_version_id=version_id,
                    total_nodes=0, total_edges=0, directories=0, files=0, classes=0,
                    functions=0, methods=0, variables=0, parameters=0, external_packages=0,
                    imports=0, calls=0, inheritance_relationships=0
                )
            
            return GraphOverviewDTO(
                repository_version_id=version_id,
                total_nodes=result["total_nodes"],
                total_edges=result["total_edges"],
                directories=result["directories"],
                files=result["files"],
                classes=result["classes"],
                functions=result["functions"],
                methods=result["methods"],
                variables=result["variables"],
                parameters=result["parameters"],
                external_packages=result["external_packages"],
                imports=result["imports"],
                calls=result["calls"],
                inheritance_relationships=result["inheritance_relationships"]
            )

    def get_subgraph(
        self, 
        version_id: str, 
        node_types: Optional[List[str]] = None,
        rel_types: Optional[List[str]] = None,
        limit: int = 500
    ) -> GraphDTO:
        
        type_filter = ""
        if node_types:
            valid_types = [t for t in node_types if t in ALLOWED_NODE_TYPES]
            if valid_types:
                # We can safely embed the labels since we validated them
                labels = ":".join(valid_types)
                # But Cypher doesn't allow OR labels easily without WHERE, so we use WHERE
                type_filter = "AND n.type IN $node_types"
            else:
                return GraphDTO(nodes=[], edges=[])

        query = f"""
        MATCH (n:GraphNode {{repository_version_id: $version_id}})
        WHERE 1=1 {type_filter}
        WITH n LIMIT $limit
        
        OPTIONAL MATCH (n)-[r]->(m:GraphNode {{repository_version_id: $version_id}})
        WHERE m.type IN $node_types
        RETURN collect(DISTINCT n) + collect(DISTINCT m) AS nodes, collect(DISTINCT r) AS edges
        """
        
        params = {"version_id": version_id, "limit": limit, "node_types": [t for t in node_types if t in ALLOWED_NODE_TYPES] if node_types else list(ALLOWED_NODE_TYPES)}
        
        with self.driver.session() as session:
            result = session.run(query, **params).single()
            if not result:
                return GraphDTO(nodes=[], edges=[])
                
            return self._parse_graph_result(result, rel_types)

    def search_nodes(self, version_id: str, query: str, limit: int = 50) -> List[GraphNodeDTO]:
        cypher = """
        MATCH (n:GraphNode {repository_version_id: $version_id})
        WHERE (n.name IS NOT NULL AND toLower(n.name) CONTAINS toLower($search_term))
           OR (n.qualified_name IS NOT NULL AND toLower(n.qualified_name) CONTAINS toLower($search_term))
        RETURN n LIMIT $limit
        """
        with self.driver.session() as session:
            result = session.run(cypher, version_id=version_id, search_term=query, limit=limit)
            nodes = []
            for record in result:
                n = record["n"]
                nodes.append(GraphNodeDTO(
                    id=n["id"],
                    type=n.get("type", "Unknown"),
                    label=n.get("name", ""),
                    repository_version_id=version_id,
                    metadata={"qualified_name": n.get("qualified_name"), "file_path": n.get("file_path")}
                ))
            return nodes

    def get_node(self, version_id: str, node_id: str) -> Optional[GraphNodeDTO]:
        cypher = """
        MATCH (n:GraphNode {id: $node_id, repository_version_id: $version_id})
        RETURN n
        """
        with self.driver.session() as session:
            record = session.run(cypher, node_id=node_id, version_id=version_id).single()
            if not record:
                return None
            n = record["n"]
            return GraphNodeDTO(
                id=n["id"],
                type=n.get("type", "Unknown"),
                label=n.get("name", ""),
                repository_version_id=version_id,
                metadata={"qualified_name": n.get("qualified_name"), "file_path": n.get("file_path")}
            )

    def get_neighbors(
        self, 
        version_id: str, 
        node_id: str, 
        direction: str = "BOTH", 
        rel_types: Optional[List[str]] = None,
        depth: int = 1,
        limit: int = 500
    ) -> GraphDTO:
        
        depth = min(depth, 3) # Hard limit depth to 3
        
        rel_filter = ""
        if rel_types:
            valid_rels = [r for r in rel_types if r in ALLOWED_REL_TYPES]
            if valid_rels:
                rel_filter = ":" + "|".join(valid_rels)
                
        dir_left = "<-" if direction in ["INCOMING", "BOTH"] else "-"
        dir_right = "->" if direction in ["OUTGOING", "BOTH"] else "-"
        if direction == "BOTH":
            dir_left = "-"
            dir_right = "-"
            
        cypher = f"""
        MATCH (start:GraphNode {{id: $node_id, repository_version_id: $version_id}})
        CALL {{
            WITH start
            MATCH path = (start){dir_left}[r{rel_filter}*1..{depth}]{dir_right}(m:GraphNode {{repository_version_id: $version_id}})
            RETURN nodes(path) AS path_nodes, relationships(path) AS path_rels
            LIMIT $limit
        }}
        UNWIND path_nodes AS n
        UNWIND path_rels AS rel
        RETURN collect(DISTINCT n) AS nodes, collect(DISTINCT rel) AS edges
        """
        
        with self.driver.session() as session:
            result = session.run(cypher, node_id=node_id, version_id=version_id, limit=limit).single()
            if not result:
                # Always return at least the starting node if it exists
                node = self.get_node(version_id, node_id)
                return GraphDTO(nodes=[node] if node else [], edges=[])
                
            return self._parse_graph_result(result, rel_types)

    def _parse_graph_result(self, record, allowed_rels=None) -> GraphDTO:
        nodes_out = []
        edges_out = []
        seen_nodes = set()
        seen_edges = set()
        
        for n in record.get("nodes", []):
            if not n or n.get("id") in seen_nodes:
                continue
            seen_nodes.add(n["id"])
            nodes_out.append(GraphNodeDTO(
                id=n["id"],
                type=n.get("type", "Unknown"),
                label=n.get("name", ""),
                repository_version_id=n.get("repository_version_id", ""),
                metadata={"qualified_name": n.get("qualified_name"), "file_path": n.get("file_path")}
            ))
            
        for e in record.get("edges", []):
            if not e:
                continue
            element_id = getattr(e, "element_id", None) or str(id(e))
            if element_id in seen_edges:
                continue
            
            # Use e.type from Neo4j relationship object
            rel_type = getattr(e, "type", None) or "RELATIONSHIP"
            if allowed_rels and rel_type not in allowed_rels:
                continue
            
            seen_edges.add(element_id)
            
            source_id = None
            target_id = None
            if hasattr(e, "start_node") and hasattr(e, "end_node"):
                source_id = e.start_node.get("id")
                target_id = e.end_node.get("id")
            elif hasattr(e, "nodes") and len(e.nodes) == 2:
                source_id = e.nodes[0].get("id")
                target_id = e.nodes[1].get("id")

            if not source_id or not target_id:
                continue

            edges_out.append(GraphEdgeDTO(
                id=str(element_id),
                type=rel_type,
                source=source_id,
                target=target_id,
                metadata={}
            ))
            
        return GraphDTO(nodes=nodes_out, edges=edges_out)

    def get_node_details(
        self, 
        version_id: str, 
        node_id: str, 
        repo_url: Optional[str] = None, 
        commit_sha: Optional[str] = None
    ) -> Optional[NodeDetailDTO]:
        cypher = """
        MATCH (n:GraphNode {id: $node_id, repository_version_id: $version_id})
        
        OPTIONAL MATCH (src:GraphNode {repository_version_id: $version_id})-[r_in]->(n)
        OPTIONAL MATCH (n)-[r_out]->(tgt:GraphNode {repository_version_id: $version_id})
        
        RETURN n,
               collect(DISTINCT {
                   id: r_in.id,
                   type: type(r_in),
                   connected_node_id: src.id,
                   connected_node_name: src.name,
                   connected_node_type: src.type,
                   direction: 'INCOMING'
               }) AS incoming,
               collect(DISTINCT {
                   id: r_out.id,
                   type: type(r_out),
                   connected_node_id: tgt.id,
                   connected_node_name: tgt.name,
                   connected_node_type: tgt.type,
                   direction: 'OUTGOING'
               }) AS outgoing
        """
        with self.driver.session() as session:
            record = session.run(cypher, node_id=node_id, version_id=version_id).single()
            if not record or not record["n"]:
                return None
            
            n = record["n"]
            incoming_raw = [r for r in record["incoming"] if r.get("type") is not None and r.get("connected_node_id") is not None]
            outgoing_raw = [r for r in record["outgoing"] if r.get("type") is not None and r.get("connected_node_id") is not None]
            
            incoming_rels = [NodeRelationshipDTO(**r) for r in incoming_raw]
            outgoing_rels = [NodeRelationshipDTO(**r) for r in outgoing_raw]
            
            fan_in = len(incoming_rels)
            fan_out = len(outgoing_rels)
            total_rels = fan_in + fan_out
            instability = round(fan_out / total_rels, 2) if total_rels > 0 else 0.0
            
            # Extract real properties stored in Neo4j
            line_start = n.get("line_start")
            line_end = n.get("line_end")
            description = n.get("description") or n.get("docstring")
            language = n.get("language")
            file_path = n.get("file_path")
            node_type = n.get("type", "Unknown")
            
            # Canonical language detection based strictly on file extension if not explicitly saved
            if not language and file_path and node_type in ["File", "Class", "Function", "Method"]:
                if file_path.endswith(".ts") or file_path.endswith(".tsx"):
                    language = "TypeScript"
                elif file_path.endswith(".js") or file_path.endswith(".jsx") or file_path.endswith(".mjs"):
                    language = "JavaScript"
                elif file_path.endswith(".py"):
                    language = "Python"
                elif file_path.endswith(".json"):
                    language = "JSON"
                elif file_path.endswith(".md"):
                    language = "Markdown"
                elif file_path.endswith(".sh"):
                    language = "Shell"
            
            # Construct real GitHub URL if repo_url is available
            github_url = None
            if repo_url and file_path and commit_sha:
                base_repo = repo_url.rstrip("/")
                github_url = f"{base_repo}/blob/{commit_sha}/{file_path}"
                if line_start is not None:
                    github_url += f"#L{line_start}"
                    if line_end is not None and line_end != line_start:
                        github_url += f"-L{line_end}"

            children_count = len([r for r in outgoing_rels if r.type == 'CONTAINS']) if node_type in ['Directory', 'RepositoryVersion'] else None

            return NodeDetailDTO(
                id=n["id"],
                type=node_type,
                name=n.get("name"),
                file_path=file_path,
                qualified_name=n.get("qualified_name"),
                line_start=line_start,
                line_end=line_end,
                language=language,
                description=description,
                source_code=None,
                github_url=github_url,
                repository_version_id=version_id,
                commit_sha=commit_sha,
                branch="main",
                status="completed" if node_type == "RepositoryVersion" else None,
                children_count=children_count,
                properties=dict(n),
                incoming_relationships=incoming_rels,
                outgoing_relationships=outgoing_rels
            )


