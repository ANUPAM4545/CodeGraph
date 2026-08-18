from abc import ABC, abstractmethod
from typing import List, Generator, Tuple
import contextlib

class SourceProvider(ABC):
    @abstractmethod
    @contextlib.contextmanager
    def acquire_source(self, repository_id: str, commit_sha: str) -> Generator[str, None, None]:
        """
        Context manager that acquires the source code for a specific commit,
        extracts it to a temporary directory, yields the root directory path,
        and cleans it up on exit.
        """
        pass
        
    @abstractmethod
    def list_files(self, source_dir: str) -> List[str]:
        """
        Lists all relevant files in the source directory (ignoring .git, node_modules, etc).
        Returns absolute paths.
        """
        pass
