import httpx
from fastapi import HTTPException
from src.services.security import GitHubTokenCipher
from src.core.config import settings

class GitHubService:
    BASE_URL = "https://api.github.com"
    
    def __init__(self, encrypted_token: str = None):
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "CodeGraph-App"
        }
        if encrypted_token:
            try:
                self.token = GitHubTokenCipher.decrypt(encrypted_token)
            except Exception:
                self.token = encrypted_token
            self.headers["Authorization"] = f"Bearer {self.token}"
        elif getattr(settings, "GITHUB_TOKEN", None):
            self.token = settings.GITHUB_TOKEN
            self.headers["Authorization"] = f"Bearer {self.token}"
        else:
            self.token = None
        
    async def get_user(self):
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.BASE_URL}/user", headers=self.headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Failed to fetch GitHub user")
            return resp.json()
            
    async def list_repositories(self):
        if not self.token:
            return []
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.BASE_URL}/user/repos?per_page=100&sort=updated", headers=self.headers)
            if resp.status_code != 200:
                return []
            return resp.json()

    async def get_repository(self, owner: str, repo: str):
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.BASE_URL}/repos/{owner}/{repo}", headers=self.headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Failed to fetch repository")
            return resp.json()

    async def get_latest_commit(self, owner: str, repo: str, branch: str = "main"):
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.BASE_URL}/repos/{owner}/{repo}/commits/{branch}", headers=self.headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Failed to fetch latest commit")
            return resp.json()

    async def compare_commits(self, owner: str, repo: str, base: str, head: str):
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.BASE_URL}/repos/{owner}/{repo}/compare/{base}...{head}", headers=self.headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Failed to compare commits")
            return resp.json()
