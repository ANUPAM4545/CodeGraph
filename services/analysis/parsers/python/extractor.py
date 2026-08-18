from typing import List, Dict, Any, Tuple
import tree_sitter
from services.analysis.domain.nodes import GraphNode, IdentityGenerator
from services.analysis.domain.relationships import GraphEdge, EdgeIdentityGenerator

class PythonExtractor:
    """
    Traverses the Python AST and extracts primary GraphNodes (Classes, Functions, Methods, Variables)
    and structural GraphEdges (DEFINES, HAS_PARAMETER).
    Returns the nodes, edges, and a list of 'unresolved' items for the Resolver.
    """
    
    def __init__(self, version_id: str, file_path: str, source_code: bytes):
        self.version_id = version_id
        self.file_path = file_path
        self.source_code = source_code
        self.nodes: List[GraphNode] = []
        self.edges: List[GraphEdge] = []
        self.unresolved_calls: List[Dict[str, Any]] = []
        self.unresolved_imports: List[Dict[str, Any]] = []
        self.unresolved_inheritance: List[Dict[str, Any]] = []
        
        # File node
        self.file_id = IdentityGenerator.file(version_id, file_path)
        self.nodes.append(GraphNode(
            id=self.file_id,
            type="File",
            repository_version_id=version_id,
            name=file_path.split("/")[-1],
            qualified_name=file_path,
            file_path=file_path
        ))

    def _get_text(self, node: tree_sitter.Node) -> str:
        return self.source_code[node.start_byte:node.end_byte].decode('utf-8')

    def extract(self, tree: tree_sitter.Tree) -> Tuple[List[GraphNode], List[GraphEdge], dict]:
        self._traverse(tree.root_node, parent_id=self.file_id, scope="")
        unresolved = {
            "calls": self.unresolved_calls,
            "imports": self.unresolved_imports,
            "inheritance": self.unresolved_inheritance
        }
        return self.nodes, self.edges, unresolved

    def _traverse(self, node: tree_sitter.Node, parent_id: str, scope: str):
        if node.type == 'class_definition':
            self._handle_class(node, parent_id, scope)
        elif node.type == 'function_definition':
            self._handle_function(node, parent_id, scope)
        elif node.type == 'import_statement' or node.type == 'import_from_statement':
            self._handle_import(node)
        elif node.type == 'call':
            self._handle_call(node, parent_id) # parent_id is the caller's node ID
        else:
            # Continue traversal for other nodes
            for child in node.children:
                self._traverse(child, parent_id, scope)

    def _handle_class(self, node: tree_sitter.Node, parent_id: str, scope: str):
        name_node = node.child_by_field_name('name')
        if not name_node:
            return
            
        class_name = self._get_text(name_node)
        qualified_name = f"{scope}.{class_name}" if scope else class_name
        class_id = IdentityGenerator.clazz(self.version_id, self.file_path, qualified_name)
        
        self.nodes.append(GraphNode(
            id=class_id,
            type="Class",
            repository_version_id=self.version_id,
            name=class_name,
            qualified_name=qualified_name,
            file_path=self.file_path,
            location={"line_start": node.start_point[0], "line_end": node.end_point[0]}
        ))
        
        self.edges.append(GraphEdge(
            id=EdgeIdentityGenerator.edge_id(parent_id, class_id, "DEFINES"),
            type="DEFINES",
            source_id=parent_id,
            target_id=class_id
        ))

        # Handle Inheritance
        superclasses_node = node.child_by_field_name('superclasses')
        if superclasses_node:
            for child in superclasses_node.children:
                if child.type == 'identifier':
                    parent_name = self._get_text(child)
                    self.unresolved_inheritance.append({
                        "class_id": class_id,
                        "parent_name": parent_name
                    })

        body = node.child_by_field_name('body')
        if body:
            for child in body.children:
                self._traverse(child, parent_id=class_id, scope=qualified_name)

    def _handle_function(self, node: tree_sitter.Node, parent_id: str, scope: str):
        name_node = node.child_by_field_name('name')
        if not name_node:
            return
            
        func_name = self._get_text(name_node)
        qualified_name = f"{scope}.{func_name}" if scope else func_name
        
        # Determine if method or function based on scope containing a class
        is_method = bool(scope)
        
        if is_method:
            func_id = IdentityGenerator.method(self.version_id, self.file_path, qualified_name)
            type_str = "Method"
        else:
            func_id = IdentityGenerator.function(self.version_id, self.file_path, qualified_name)
            type_str = "Function"
            
        self.nodes.append(GraphNode(
            id=func_id,
            type=type_str,
            repository_version_id=self.version_id,
            name=func_name,
            qualified_name=qualified_name,
            file_path=self.file_path,
            location={"line_start": node.start_point[0], "line_end": node.end_point[0]}
        ))
        
        self.edges.append(GraphEdge(
            id=EdgeIdentityGenerator.edge_id(parent_id, func_id, "DEFINES"),
            type="DEFINES",
            source_id=parent_id,
            target_id=func_id
        ))

        # Parameters
        params_node = node.child_by_field_name('parameters')
        if params_node:
            idx = 0
            for child in params_node.children:
                if child.type in ['identifier', 'typed_parameter', 'default_parameter']:
                    # simplification
                    if child.type == 'identifier':
                        param_name = self._get_text(child)
                    else:
                        id_node = child.child_by_field_name('name') or child.children[0]
                        param_name = self._get_text(id_node)
                        
                    param_id = IdentityGenerator.parameter(self.version_id, func_id, param_name)
                    self.nodes.append(GraphNode(
                        id=param_id,
                        type="Parameter",
                        repository_version_id=self.version_id,
                        name=param_name,
                        qualified_name=param_name
                    ))
                    self.edges.append(GraphEdge(
                        id=EdgeIdentityGenerator.edge_id(func_id, param_id, "HAS_PARAMETER"),
                        type="HAS_PARAMETER",
                        source_id=func_id,
                        target_id=param_id,
                        metadata={"index": idx}
                    ))
                    idx += 1

        body = node.child_by_field_name('body')
        if body:
            for child in body.children:
                self._traverse(child, parent_id=func_id, scope=qualified_name)

    def _handle_import(self, node: tree_sitter.Node):
        if node.type == 'import_statement':
            # import x, y
            for child in node.children:
                if child.type == 'dotted_name':
                    module_name = self._get_text(child)
                    self.unresolved_imports.append({
                        "file_id": self.file_id,
                        "module": module_name,
                        "symbol": None
                    })
        elif node.type == 'import_from_statement':
            # from x import y
            module_node = node.child_by_field_name('module_name')
            if module_node:
                module_name = self._get_text(module_node)
                for child in node.children:
                    if child.type == 'dotted_name' or child.type == 'aliased_import':
                        symbol = self._get_text(child)
                        self.unresolved_imports.append({
                            "file_id": self.file_id,
                            "module": module_name,
                            "symbol": symbol
                        })

    def _handle_call(self, node: tree_sitter.Node, caller_id: str):
        func_node = node.child_by_field_name('function')
        if func_node:
            called_name = self._get_text(func_node)
            self.unresolved_calls.append({
                "caller_id": caller_id,
                "called_name": called_name,
                "line": node.start_point[0]
            })
            
        # calls can contain calls in arguments
        args_node = node.child_by_field_name('arguments')
        if args_node:
            for child in args_node.children:
                self._traverse(child, caller_id, "")
