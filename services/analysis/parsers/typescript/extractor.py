import os
import re
import json
from typing import List, Dict, Any, Tuple, Optional
from services.analysis.domain.nodes import GraphNode, IdentityGenerator
from services.analysis.domain.relationships import GraphEdge, EdgeIdentityGenerator

class TypeScriptExtractor:
    """
    Extracts canonical graph entities (Classes, Functions, Methods, Variables, ExternalPackages)
    and relationships (DEFINES, IMPORTS, CALLS, INHERITS) from TypeScript/JavaScript and package.json files.
    """
    def __init__(self, version_id: str, file_path: str, source_code: bytes):
        self.version_id = version_id
        self.file_path = file_path
        self.source_code = source_code
        self.source_text = source_code.decode('utf-8', errors='replace')
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

    def extract(self) -> Tuple[List[GraphNode], List[GraphEdge], dict]:
        # Handle package.json special case
        if self.file_path.endswith("package.json"):
            self._extract_package_json()
            return self.nodes, self.edges, {
                "calls": self.unresolved_calls,
                "imports": self.unresolved_imports,
                "inheritance": self.unresolved_inheritance
            }

        lines = self.source_text.splitlines()

        # 1. Extract Imports
        self._extract_imports(lines)

        # 2. Extract Classes & Interfaces
        self._extract_classes_and_interfaces(lines)

        # 3. Extract Functions & Arrow Functions & React Components
        self._extract_functions(lines)

        # 4. Extract Calls
        self._extract_calls(lines)

        unresolved = {
            "calls": self.unresolved_calls,
            "imports": self.unresolved_imports,
            "inheritance": self.unresolved_inheritance
        }
        return self.nodes, self.edges, unresolved

    def _extract_package_json(self):
        try:
            data = json.loads(self.source_text)
            all_deps = {}
            for dep_key in ["dependencies", "devDependencies", "peerDependencies"]:
                if dep_key in data and isinstance(data[dep_key], dict):
                    all_deps.update(data[dep_key])

            for pkg_name, version in all_deps.items():
                pkg_id = IdentityGenerator.external_package(self.version_id, pkg_name)
                self.nodes.append(GraphNode(
                    id=pkg_id,
                    type="ExternalPackage",
                    repository_version_id=self.version_id,
                    name=pkg_name,
                    qualified_name=f"npm:{pkg_name}@{version}",
                    file_path=self.file_path,
                    metadata={"version": str(version)}
                ))
                self.edges.append(GraphEdge(
                    id=EdgeIdentityGenerator.edge_id(self.file_id, pkg_id, "IMPORTS"),
                    type="IMPORTS",
                    source_id=self.file_id,
                    target_id=pkg_id
                ))
        except Exception:
            pass

    def _extract_imports(self, lines: List[str]):
        # Matches: import { a, b } from 'pkg' or import a from './file' or import * as a from 'pkg' or require('pkg')
        import_pattern = re.compile(r'''(?:import\s+(?:(?:\*\s+as\s+[\w$]+|[\w$]+|\{[^}]*\})\s+from\s+)?['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))''')

        for idx, line in enumerate(lines, start=1):
            line_str = line.strip()
            if not line_str.startswith("import") and "require(" not in line_str:
                continue

            match = import_pattern.search(line_str)
            if match:
                import_path = match.group(1) or match.group(2)
                if not import_path:
                    continue

                if import_path.startswith("."):
                    # Relative import within repository
                    self.unresolved_imports.append({
                        "file_id": self.file_id,
                        "source_file": self.file_path,
                        "import_path": import_path,
                        "line": idx
                    })
                else:
                    # External package (e.g. react, next, lodash, @prisma/client)
                    pkg_name = import_path.split("/")[0]
                    if import_path.startswith("@") and "/" in import_path:
                        pkg_name = "/".join(import_path.split("/")[:2])

                    pkg_id = IdentityGenerator.external_package(self.version_id, pkg_name)
                    # Add ExternalPackage node if not exists
                    if not any(n.id == pkg_id for n in self.nodes):
                        self.nodes.append(GraphNode(
                            id=pkg_id,
                            type="ExternalPackage",
                            repository_version_id=self.version_id,
                            name=pkg_name,
                            qualified_name=f"npm:{pkg_name}",
                            file_path=self.file_path
                        ))
                    self.edges.append(GraphEdge(
                        id=EdgeIdentityGenerator.edge_id(self.file_id, pkg_id, "IMPORTS"),
                        type="IMPORTS",
                        source_id=self.file_id,
                        target_id=pkg_id
                    ))

    def _extract_classes_and_interfaces(self, lines: List[str]):
        # Matches: export class Foo extends Bar implements Baz { or interface Foo extends Bar {
        class_pattern = re.compile(r'''(?:export\s+)?(?:abstract\s+)?(class|interface)\s+([A-Za-z0-9_$]+)(?:\s+extends\s+([A-Za-z0-9_$,\s]+))?(?:\s+implements\s+([A-Za-z0-9_$,\s]+))?''')
        method_pattern = re.compile(r'''^\s*(?:public|private|protected|async|static|\s)*([A-Za-z0-9_$]+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{''')

        inside_class = None
        class_id = None
        class_start = 1
        brace_depth = 0

        for idx, line in enumerate(lines, start=1):
            class_match = class_pattern.search(line)
            if class_match and not inside_class:
                kind = class_match.group(1)
                name = class_match.group(2)
                extends_clause = class_match.group(3)

                qualified_name = f"{self.file_path}:{name}"
                class_id = IdentityGenerator.clazz(self.version_id, self.file_path, qualified_name)
                inside_class = name
                class_start = idx
                brace_depth = line.count("{") - line.count("}")

                self.nodes.append(GraphNode(
                    id=class_id,
                    type="Class",
                    repository_version_id=self.version_id,
                    name=name,
                    qualified_name=qualified_name,
                    file_path=self.file_path,
                    location={"line_start": class_start, "line_end": idx},
                    metadata={"kind": kind}
                ))

                self.edges.append(GraphEdge(
                    id=EdgeIdentityGenerator.edge_id(self.file_id, class_id, "DEFINES"),
                    type="DEFINES",
                    source_id=self.file_id,
                    target_id=class_id
                ))

                if extends_clause:
                    for parent in [p.strip() for p in extends_clause.split(",") if p.strip()]:
                        self.unresolved_inheritance.append({
                            "class_id": class_id,
                            "parent_name": parent
                        })
                continue

            if inside_class and class_id:
                # Check for method definition inside class
                method_match = method_pattern.search(line)
                if method_match:
                    m_name = method_match.group(1)
                    if m_name not in {"if", "for", "while", "switch", "catch", "constructor"}:
                        m_qname = f"{self.file_path}:{inside_class}.{m_name}"
                        m_id = IdentityGenerator.method(self.version_id, self.file_path, m_qname)
                        
                        self.nodes.append(GraphNode(
                            id=m_id,
                            type="Method",
                            repository_version_id=self.version_id,
                            name=m_name,
                            qualified_name=m_qname,
                            file_path=self.file_path,
                            location={"line_start": idx, "line_end": idx}
                        ))
                        self.edges.append(GraphEdge(
                            id=EdgeIdentityGenerator.edge_id(class_id, m_id, "DEFINES"),
                            type="DEFINES",
                            source_id=class_id,
                            target_id=m_id
                        ))

                brace_depth += line.count("{") - line.count("}")
                if brace_depth <= 0:
                    inside_class = None
                    class_id = None

    def _extract_functions(self, lines: List[str]):
        # Matches:
        # export function foo(...) or function foo(...)
        # export const foo = (...) => or const foo = async (...) =>
        # export default function Foo(...)
        func_decl_pattern = re.compile(r'''(?:export\s+(?:default\s+)?)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(''')
        arrow_func_pattern = re.compile(r'''(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z0-9_$]+)\s*(?::\s*[^=]+)?\s*=>''')

        for idx, line in enumerate(lines, start=1):
            name = None
            f_match = func_decl_pattern.search(line)
            if f_match:
                name = f_match.group(1)
            else:
                a_match = arrow_func_pattern.search(line)
                if a_match:
                    name = a_match.group(1)

            if name and name not in {"describe", "test", "it", "beforeEach", "afterEach"}:
                qname = f"{self.file_path}:{name}"
                fn_id = IdentityGenerator.function(self.version_id, self.file_path, qname)

                # Avoid duplicates
                if not any(n.id == fn_id for n in self.nodes):
                    self.nodes.append(GraphNode(
                        id=fn_id,
                        type="Function",
                        repository_version_id=self.version_id,
                        name=name,
                        qualified_name=qname,
                        file_path=self.file_path,
                        location={"line_start": idx, "line_end": idx}
                    ))
                    self.edges.append(GraphEdge(
                        id=EdgeIdentityGenerator.edge_id(self.file_id, fn_id, "DEFINES"),
                        type="DEFINES",
                        source_id=self.file_id,
                        target_id=fn_id
                    ))

    def _extract_calls(self, lines: List[str]):
        # Matches: foo() or obj.foo()
        call_pattern = re.compile(r'''\b([A-Za-z0-9_$]+)\s*\(''')
        for idx, line in enumerate(lines, start=1):
            line_str = line.strip()
            if line_str.startswith("//") or line_str.startswith("/*") or line_str.startswith("*"):
                continue
            for match in call_pattern.finditer(line):
                callee_name = match.group(1)
                if callee_name not in {
                    "if", "for", "while", "switch", "catch", "function", "import", "require",
                    "return", "typeof", "console", "log", "error", "warn", "info", "parseInt",
                    "parseFloat", "String", "Number", "Boolean", "Array", "Object", "Promise",
                    "Set", "Map", "describe", "test", "it", "expect"
                }:
                    self.unresolved_calls.append({
                        "file_id": self.file_id,
                        "callee_name": callee_name,
                        "line": idx
                    })
