import logging
from typing import Optional, Dict, Any
from ..github import GitHubService
from .dto import GitHubMetadataDTO

logger = logging.getLogger(__name__)

class GitHubMetadataAnalyzer:
    """
    Fetches real GitHub repository telemetry, stars, forks, license, and latest commit info.
    """
    def __init__(self, github_service: GitHubService):
        self.github = github_service

    async def analyze(self, full_name: str, fallback_branch: str = "main") -> Optional[GitHubMetadataDTO]:
        if not full_name or "/" not in full_name:
            return None
            
        parts = full_name.split("/", 1)
        owner, repo = parts[0], parts[1]
        
        try:
            repo_data = await self.github.get_repository(owner, repo)
            commit_data = None
            try:
                commit_data = await self.github.get_latest_commit(owner, repo, branch=repo_data.get("default_branch") or fallback_branch)
            except Exception as ce:
                logger.warning(f"Could not fetch latest commit from GitHub for {full_name}: {ce}")
                
            license_name = None
            if repo_data.get("license") and isinstance(repo_data["license"], dict):
                license_name = repo_data["license"].get("name") or repo_data["license"].get("spdx_id")
                
            last_sha = None
            last_date = None
            if commit_data and isinstance(commit_data, dict):
                last_sha = commit_data.get("sha")
                commit_obj = commit_data.get("commit", {})
                author = commit_obj.get("author", {}) or commit_obj.get("committer", {})
                last_date = author.get("date")

            return GitHubMetadataDTO(
                name=repo_data.get("name") or repo,
                full_name=repo_data.get("full_name") or full_name,
                description=repo_data.get("description"),
                visibility="private" if repo_data.get("private") else "public",
                stars=repo_data.get("stargazers_count", 0),
                forks=repo_data.get("forks_count", 0),
                default_branch=repo_data.get("default_branch") or fallback_branch,
                license=license_name,
                html_url=repo_data.get("html_url") or f"https://github.com/{full_name}",
                last_commit_sha=last_sha,
                last_commit_date=last_date
            )
        except Exception as e:
            logger.warning(f"Failed to fetch GitHub metadata for {full_name}: {e}")
            return None
