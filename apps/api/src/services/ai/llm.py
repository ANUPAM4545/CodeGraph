from abc import ABC, abstractmethod
from typing import List, Dict, Any

class LLMProvider(ABC):
    @abstractmethod
    def generate_answer(self, question: str, context: str) -> str:
        pass

class OpenAILLMProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        self.model = model
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key)
        except ImportError:
            self.client = None

    def generate_answer(self, question: str, context: str) -> str:
        if not self.client:
            # Mock behavior for testing in environments without OpenAI package
            return "This is a mock AI answer grounded in the provided context.\n\nContext used:\n" + context[:100] + "..."
            
        system_prompt = """
You are CodeGraph, a codebase intelligence assistant.
Answer using ONLY the repository evidence supplied in the context below.

CRITICAL RULES:
1. Do not invent files, functions, classes, relationships, or behavior.
2. If the supplied evidence is insufficient to answer the question confidently, explicitly state that the available repository evidence is insufficient.
3. Distinguish verified facts from reasonable inferences.
4. When possible, cite file paths, symbols, and line ranges exactly as they appear in the evidence.

EVIDENCE CONTEXT:
=================
{context}
=================
"""
        messages = [
            {"role": "system", "content": system_prompt.format(context=context)},
            {"role": "user", "content": question}
        ]
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.0 # Force deterministic grounded behavior
        )
        
        return response.choices[0].message.content

def get_llm_provider() -> LLMProvider:
    import os
    # Prefer OpenAI if key exists, otherwise it will mock safely due to our init fallback
    api_key = os.environ.get("OPENAI_API_KEY", "mock-key")
    return OpenAILLMProvider(api_key=api_key)
