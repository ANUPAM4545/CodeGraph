import os
from neo4j import GraphDatabase

NEO4J_URI = "bolt://neo4j:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "codegraph_neo4j"
REPO_VERSION_ID = "1777fa77-9a26-4563-a7de-093cdb40d913"

def seed_graph():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        delete_query = """
        MATCH (n) WHERE n.repository_version_id = $version_id DETACH DELETE n
        """
        
        create_query = """
        // Create nodes
        CREATE (d:GraphNode:Directory {id: 'dir_src', type: 'Directory', name: 'src', repository_version_id: $version_id, qualified_name: 'src', file_path: 'src'})
        CREATE (f:GraphNode:File {id: 'file_index', type: 'File', name: 'index.ts', repository_version_id: $version_id, qualified_name: 'src/index.ts', file_path: 'src/index.ts'})
        CREATE (fn1:GraphNode:Function {id: 'fn_bootstrap', type: 'Function', name: 'bootstrap', repository_version_id: $version_id, qualified_name: 'src/index.ts:bootstrap', file_path: 'src/index.ts'})
        CREATE (fn2:GraphNode:Function {id: 'fn_init', type: 'Function', name: 'initSystem', repository_version_id: $version_id, qualified_name: 'src/index.ts:initSystem', file_path: 'src/index.ts'})
        CREATE (c:GraphNode:Class {id: 'class_App', type: 'Class', name: 'Application', repository_version_id: $version_id, qualified_name: 'src/app.ts:Application', file_path: 'src/app.ts'})
        
        // Create edges
        CREATE (d)-[:CONTAINS {id: 'e1', type: 'CONTAINS'}]->(f)
        CREATE (f)-[:DEFINES {id: 'e2', type: 'DEFINES'}]->(fn1)
        CREATE (f)-[:DEFINES {id: 'e3', type: 'DEFINES'}]->(fn2)
        CREATE (f)-[:DEFINES {id: 'e4', type: 'DEFINES'}]->(c)
        CREATE (fn1)-[:CALLS {id: 'e5', type: 'CALLS'}]->(fn2)
        CREATE (fn2)-[:INSTANTIATES {id: 'e6', type: 'INSTANTIATES'}]->(c)
        """
        session.run(delete_query, version_id=REPO_VERSION_ID)
        session.run(create_query, version_id=REPO_VERSION_ID)
        print("Mock graph data inserted successfully!")
    driver.close()

if __name__ == "__main__":
    seed_graph()
