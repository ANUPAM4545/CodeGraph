import os
import httpx
import tempfile
import tarfile
import shutil
import contextlib
import logging
from typing import List, Generator, Optional
from services.analysis.source.base import SourceProvider

class GitHubSourceProvider(SourceProvider):
    SUPPORTED_EXTENSIONS = {
        ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
        ".py", ".pyi",
        ".json", ".yaml", ".yml", ".toml",
        ".md", ".mdx", ".txt",
        ".css", ".scss", ".less", ".html",
        ".sh", ".bash", ".zsh",
        ".sql", ".graphql", ".gql",
        ".go", ".rs", ".java", ".kt", ".c", ".cpp", ".h", ".hpp"
    }

    def __init__(self, token: Optional[str], full_name: str):
        self.token = token
        self.full_name = full_name # "owner/repo"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "CodeGraph-App"
        }
        if self.token:
            self.headers["Authorization"] = f"Bearer {self.token}"
            
        self.ignore_dirs = {
            ".git", "node_modules", ".next", "dist", "build", "coverage", 
            "__pycache__", ".pytest_cache", ".venv", "venv", "target", 
            "vendor", ".turbo", ".idea", ".vscode", ".gemini"
        }

    @contextlib.contextmanager
    def acquire_source(self, repository_id: str, commit_sha: str) -> Generator[str, None, None]:
        temp_dir = tempfile.mkdtemp(prefix=f"codegraph_{repository_id}_{commit_sha}_")
        tar_path = os.path.join(temp_dir, "source.tar.gz")
        
        # Build candidate refs to try (prefer exact commit_sha, then branch fallbacks)
        candidate_refs = []
        if commit_sha and commit_sha != "latest_commit":
            candidate_refs.append(commit_sha)
        for fallback in ["main", "master", "HEAD"]:
            if fallback not in candidate_refs:
                candidate_refs.append(fallback)

        urls_to_try = []
        for ref in candidate_refs:
            if self.token:
                urls_to_try.append((f"https://api.github.com/repos/{self.full_name}/tarball/{ref}", self.headers))
            # Public download fallback
            urls_to_try.append((f"https://github.com/{self.full_name}/archive/{ref}.tar.gz", {"Accept": "*/*", "User-Agent": "CodeGraph-App"}))
            urls_to_try.append((f"https://api.github.com/repos/{self.full_name}/tarball/{ref}", {"Accept": "application/vnd.github.v3+json", "User-Agent": "CodeGraph-App"}))

        download_success = False
        last_error = None

        for url, req_headers in urls_to_try:
            try:
                with httpx.Client(follow_redirects=True, timeout=60.0) as client:
                    with client.stream("GET", url, headers=req_headers) as response:
                        if response.status_code == 200:
                            with open(tar_path, "wb") as f:
                                for chunk in response.iter_bytes():
                                    f.write(chunk)
                            download_success = True
                            break
                        else:
                            last_error = f"HTTP {response.status_code} from {url}"
            except Exception as e:
                last_error = str(e)

        if not download_success:
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise Exception(f"Failed to download source from GitHub for {self.full_name}@{commit_sha}: {last_error}")

        try:
            # Extract tarball
            with tarfile.open(tar_path, "r:gz") as tar:
                tar.extractall(path=temp_dir)
                
            # GitHub tarballs unpack to a single root directory (e.g. owner-repo-sha)
            extracted_items = [name for name in os.listdir(temp_dir) if name != "source.tar.gz"]
            if len(extracted_items) == 1 and os.path.isdir(os.path.join(temp_dir, extracted_items[0])):
                root_dir = os.path.join(temp_dir, extracted_items[0])
            else:
                root_dir = temp_dir
                
            yield root_dir
            
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)
            
    def list_files(self, source_dir: str) -> List[str]:
        files = []
        for root, dirs, filenames in os.walk(source_dir):
            # Prune ignored directories in place
            dirs[:] = [d for d in dirs if d not in self.ignore_dirs and not d.startswith(".")]
            
            for filename in filenames:
                _, ext = os.path.splitext(filename)
                if ext.lower() in self.SUPPORTED_EXTENSIONS or filename in {"Dockerfile", "Makefile", "package.json", "tsconfig.json"}:
                    full_path = os.path.join(root, filename)
                    # Skip files > 2MB
                    try:
                        if os.path.getsize(full_path) <= 2 * 1024 * 1024:
                            files.append(full_path)
                    except OSError:
                        pass
        return sorted(files)
