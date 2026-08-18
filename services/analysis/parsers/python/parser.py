import tree_sitter
import tree_sitter_python as tspython
import logging

class PythonParser:
    def __init__(self):
        try:
            # For tree-sitter >= 0.22.0
            self.language = tree_sitter.Language(tspython.language())
            self.parser = tree_sitter.Parser(self.language)
        except Exception as e:
            logging.error(f"Failed to initialize tree-sitter python parser: {e}")
            self.parser = None
            
    def parse(self, source_code: bytes) -> tree_sitter.Tree:
        if not self.parser:
            raise RuntimeError("Parser not initialized correctly")
        return self.parser.parse(source_code)
