import pytest
from services.analysis.parsers.python.parser import PythonParser
from services.analysis.parsers.python.extractor import PythonExtractor
from services.analysis.parsers.python.resolver import PythonResolver
from services.analysis.domain.graph import CanonicalGraph

def test_python_parsing_and_extraction():
    code = b"""
import os
from external_pkg import something

class Parent:
    pass

class Child(Parent):
    def method(self, param1):
        something()
        self.other_method()

def standalone_func():
    child = Child()
    child.method(1)
"""
    parser = PythonParser()
    tree = parser.parse(code)
    
    extractor = PythonExtractor(version_id="test_version", file_path="test.py", source_code=code)
    nodes, edges, unresolved = extractor.extract(tree)
    
    assert len(nodes) > 0
    node_types = [n.type for n in nodes]
    assert "Class" in node_types
    assert "Method" in node_types
    assert "Function" in node_types
    assert "Parameter" in node_types
    
    # Test Resolution
    resolver = PythonResolver(version_id="test_version")
    resolver.register_nodes(nodes)
    resolver.resolve(unresolved)
    
    assert len(resolver.resolved_edges) > 0
    edge_types = [e.type for e in resolver.resolved_edges]
    assert "INHERITS" in edge_types
    assert "CALLS" in edge_types
    assert "IMPORTS" in edge_types
    
    # Validate ExternalPackage creation
    external_pkgs = [n for n in resolver.resolved_nodes if n.type == "ExternalPackage"]
    assert len(external_pkgs) > 0
    assert external_pkgs[0].name in ["os", "external_pkg"]
