import hashlib
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class GraphNode(BaseModel):
    id: str
    type: str
    repository_version_id: str
    name: str
    qualified_name: str
    file_path: Optional[str] = None
    location: Optional[Dict[str, int]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class IdentityGenerator:
    @staticmethod
    def _hash(val: str) -> str:
        return hashlib.sha256(val.encode('utf-8')).hexdigest()

    @classmethod
    def file(cls, version_id: str, path: str) -> str:
        return cls._hash(f"{version_id}:{path}")

    @classmethod
    def directory(cls, version_id: str, path: str) -> str:
        return cls._hash(f"{version_id}:dir:{path}")

    @classmethod
    def clazz(cls, version_id: str, file_path: str, qualified_name: str) -> str:
        return cls._hash(f"{version_id}:{file_path}:class:{qualified_name}")

    @classmethod
    def function(cls, version_id: str, file_path: str, qualified_name: str) -> str:
        return cls._hash(f"{version_id}:{file_path}:function:{qualified_name}")

    @classmethod
    def method(cls, version_id: str, file_path: str, qualified_name: str) -> str:
        return cls._hash(f"{version_id}:{file_path}:method:{qualified_name}")

    @classmethod
    def variable(cls, version_id: str, file_path: str, qualified_name: str) -> str:
        return cls._hash(f"{version_id}:{file_path}:variable:{qualified_name}")

    @classmethod
    def parameter(cls, version_id: str, method_or_func_id: str, name: str) -> str:
        return cls._hash(f"{version_id}:{method_or_func_id}:parameter:{name}")

    @classmethod
    def external_package(cls, version_id: str, name: str) -> str:
        return cls._hash(f"{version_id}:external_package:{name}")

    @classmethod
    def repo_version(cls, version_id: str) -> str:
        return cls._hash(f"repo_version:{version_id}")
