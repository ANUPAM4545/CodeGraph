from typing import List, Dict, Any
from services.analysis.domain.nodes import GraphNode, IdentityGenerator
from services.analysis.domain.relationships import GraphEdge, EdgeIdentityGenerator

class PythonResolver:
    """
    Attempts conservative resolution of CALLS, IMPORTS, and INHERITS relationships.
    Creates ExternalPackage nodes for unresolved imports.
    """
    
    def __init__(self, version_id: str):
        self.version_id = version_id
        # Global maps for the whole repository version
        self.classes: Dict[str, GraphNode] = {} # qualified_name or name -> Node
        self.functions: Dict[str, GraphNode] = {} # qualified_name or name -> Node
        self.files: Dict[str, GraphNode] = {} # file path -> Node
        self.resolved_nodes: List[GraphNode] = []
        self.resolved_edges: List[GraphEdge] = []

    def register_nodes(self, nodes: List[GraphNode]):
        for n in nodes:
            if n.type == "Class":
                self.classes[n.qualified_name] = n
                # Also store by simple name for fallback
                self.classes[n.name] = n
            elif n.type in ("Function", "Method"):
                self.functions[n.qualified_name] = n
                self.functions[n.name] = n
            elif n.type == "File":
                # Convert path to module format roughly
                module_path = n.file_path.replace(".py", "").replace("/", ".")
                self.files[module_path] = n

    def resolve(self, unresolved: Dict[str, List[Dict[str, Any]]]):
        self._resolve_inheritance(unresolved.get("inheritance", []))
        self._resolve_imports(unresolved.get("imports", []))
        self._resolve_calls(unresolved.get("calls", []))
        
    def _resolve_inheritance(self, inheritances: List[Dict[str, Any]]):
        for item in inheritances:
            child_id = item["class_id"]
            parent_name = item["parent_name"]
            # Conservative: if we have seen this class name
            if parent_name in self.classes:
                target_id = self.classes[parent_name].id
                self.resolved_edges.append(GraphEdge(
                    id=EdgeIdentityGenerator.edge_id(child_id, target_id, "INHERITS"),
                    type="INHERITS",
                    source_id=child_id,
                    target_id=target_id
                ))

    def _resolve_imports(self, imports: List[Dict[str, Any]]):
        external_packages_created = set()
        for item in imports:
            file_id = item["file_id"]
            module = item["module"]
            # Try to match internal file
            if module in self.files:
                target_id = self.files[module].id
            else:
                # Treat as ExternalPackage
                top_level_pkg = module.split(".")[0]
                target_id = IdentityGenerator.external_package(self.version_id, top_level_pkg)
                if top_level_pkg not in external_packages_created:
                    self.resolved_nodes.append(GraphNode(
                        id=target_id,
                        type="ExternalPackage",
                        repository_version_id=self.version_id,
                        name=top_level_pkg,
                        qualified_name=top_level_pkg
                    ))
                    external_packages_created.add(top_level_pkg)
                    
            self.resolved_edges.append(GraphEdge(
                id=EdgeIdentityGenerator.edge_id(file_id, target_id, "IMPORTS"),
                type="IMPORTS",
                source_id=file_id,
                target_id=target_id,
                metadata={"symbol": item.get("symbol")}
            ))

    def _resolve_calls(self, calls: List[Dict[str, Any]]):
        for item in calls:
            caller_id = item["caller_id"]
            called_name = item["called_name"]
            
            # Very conservative resolution: match exact name or method
            # Example: foo() or self.foo() or obj.foo()
            method_name = called_name.split(".")[-1]
            
            if method_name in self.functions:
                target_id = self.functions[method_name].id
                self.resolved_edges.append(GraphEdge(
                    id=EdgeIdentityGenerator.edge_id(caller_id, target_id, "CALLS"),
                    type="CALLS",
                    source_id=caller_id,
                    target_id=target_id,
                    metadata={"line": item.get("line")}
                ))
