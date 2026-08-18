import logging
from typing import Dict, Any, List
from neo4j import GraphDatabase
from services.analysis.domain.graph import CanonicalGraph
from services.analysis.graph.base import GraphRepository

class Neo4jGraphRepository(GraphRepository):
    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        
    def close(self):
        self.driver.close()
        
    def setup_constraints(self):
        """
        Creates necessary indexes and constraints in Neo4j.
        """
        queries = [
            "CREATE CONSTRAINT unique_node_id IF NOT EXISTS FOR (n:GraphNode) REQUIRE n.id IS UNIQUE",
            "CREATE INDEX node_repo_version IF NOT EXISTS FOR (n:GraphNode) ON (n.repository_version_id)",
        ]
        with self.driver.session() as session:
            for q in queries:
                try:
                    session.run(q)
                except Exception as e:
                    logging.warning(f"Failed to create constraint/index: {e}")

    def delete_version_graph(self, repository_version_id: str) -> None:
        """
        Delete-and-rebuild strategy: Wipes all nodes (and their connected edges)
        for the given repository version.
        """
        query = """
        MATCH (n {repository_version_id: $version_id})
        DETACH DELETE n
        """
        with self.driver.session() as session:
            session.run(query, version_id=repository_version_id)
            
    def save_graph(self, graph: CanonicalGraph) -> None:
        """
        Saves the nodes and edges into Neo4j in batches using UNWIND for efficiency.
        """
        # Ensure clean slate for this version (occurs ONLY right before save, preserving the old graph if analysis fails)
        self.delete_version_graph(graph.repository_version_id)
        
        # Group nodes by type to avoid dynamic APOC labels
        nodes_by_type: Dict[str, List[Dict[str, Any]]] = {}
        for n in graph.nodes:
            nodes_by_type.setdefault(n.type, []).append({
                "id": n.id,
                "type": n.type,
                "repository_version_id": n.repository_version_id,
                "name": n.name,
                "qualified_name": n.qualified_name,
                "file_path": n.file_path
            })
            
        with self.driver.session() as session:
            for node_type, node_list in nodes_by_type.items():
                # Safe because node_type comes from our internal domain enum/strings
                node_query = f"""
                UNWIND $nodes AS node
                MERGE (n:GraphNode:{node_type} {{id: node.id}})
                SET n.type = node.type,
                    n.repository_version_id = node.repository_version_id,
                    n.name = node.name,
                    n.qualified_name = node.qualified_name,
                    n.file_path = node.file_path
                """
                session.run(node_query, nodes=node_list)
            
        # Batch create edges
        # We must use apoc.create.relationship if type is dynamic, 
        # but without APOC we can write a switch or just execute per type.
        # Let's group edges by type to do safe parameterized Cypher without APOC.
        
        edges_by_type: Dict[str, List[Dict[str, Any]]] = {}
        for e in graph.edges:
            edges_by_type.setdefault(e.type, []).append({
                "id": e.id,
                "source_id": e.source_id,
                "target_id": e.target_id
            })
            
        with self.driver.session() as session:
            for edge_type, edge_list in edges_by_type.items():
                # Note: edge_type is safe here as it comes from our predefined constants
                edge_query = f"""
                UNWIND $edges AS edge
                MATCH (source:GraphNode {{id: edge.source_id}})
                MATCH (target:GraphNode {{id: edge.target_id}})
                MERGE (source)-[r:{edge_type} {{id: edge.id}}]->(target)
                """
                session.run(edge_query, edges=edge_list)
