from typing import List
from .retrievers import RetrievedEvidence
import logging

class ContextBuilder:
    """
    Normalizes, truncates, and formats retrieval evidence into a grounded prompt context
    while respecting a hard token budget.
    """
    def __init__(self, max_tokens: int = 6000):
        self.max_tokens = max_tokens
        # Approximation: 1 token ~= 4 chars for standard code/text
        self.max_chars = max_tokens * 4
        
    def build_context_string(self, evidence: List[RetrievedEvidence]) -> str:
        if not evidence:
            return "No relevant repository evidence found."
            
        context_blocks = []
        current_chars = 0
        
        for ev in evidence:
            block = self._format_evidence(ev)
            if current_chars + len(block) > self.max_chars:
                logging.info("Context budget reached. Truncating remaining evidence.")
                break
                
            context_blocks.append(block)
            current_chars += len(block)
            
        return "\n\n---\n\n".join(context_blocks)

    def _format_evidence(self, ev: RetrievedEvidence) -> str:
        lines = []
        lines.append(f"[{ev.source_type}]")
        
        if ev.metadata.get("file_path"):
            lines.append(f"FILE: {ev.metadata['file_path']}")
            
        if ev.metadata.get("symbol_name"):
            lines.append(f"SYMBOL: {ev.metadata['symbol_name']}")
            
        if ev.metadata.get("line_start") and ev.metadata.get("line_end"):
            lines.append(f"LINES: {ev.metadata['line_start']}-{ev.metadata['line_end']}")
            
        lines.append(f"\nSOURCE/CONTENT:\n{ev.content}")
        return "\n".join(lines)
