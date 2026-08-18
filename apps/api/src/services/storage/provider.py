import os
import shutil
from typing import Optional
from abc import ABC, abstractmethod

class StorageProvider(ABC):
    @abstractmethod
    def upload(self, source_path: str, destination_key: str) -> str:
        pass

    @abstractmethod
    def download(self, key: str, destination_path: str) -> bool:
        pass

    @abstractmethod
    def delete(self, key: str) -> bool:
        pass
        
    @abstractmethod
    def exists(self, key: str) -> bool:
        pass

class LocalStorageProvider(StorageProvider):
    def __init__(self, base_dir: str = "/tmp/codegraph_storage"):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)
        
    def _get_abs_path(self, key: str) -> str:
        return os.path.join(self.base_dir, key)

    def upload(self, source_path: str, destination_key: str) -> str:
        dest_path = self._get_abs_path(destination_key)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        shutil.copy2(source_path, dest_path)
        return dest_path

    def download(self, key: str, destination_path: str) -> bool:
        source_path = self._get_abs_path(key)
        if not os.path.exists(source_path):
            return False
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        shutil.copy2(source_path, destination_path)
        return True

    def delete(self, key: str) -> bool:
        target = self._get_abs_path(key)
        if os.path.exists(target):
            os.remove(target)
            return True
        return False
        
    def exists(self, key: str) -> bool:
        return os.path.exists(self._get_abs_path(key))

class S3StorageProvider(StorageProvider):
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        # Note: Boto3 initialization stub
        
    def upload(self, source_path: str, destination_key: str) -> str:
        raise NotImplementedError("S3 integration pending")

    def download(self, key: str, destination_path: str) -> bool:
        raise NotImplementedError("S3 integration pending")

    def delete(self, key: str) -> bool:
        raise NotImplementedError("S3 integration pending")
        
    def exists(self, key: str) -> bool:
        raise NotImplementedError("S3 integration pending")
