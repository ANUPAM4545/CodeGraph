import logging

logger = logging.getLogger(__name__)

class ChangeDetector:
    def __init__(self, github_service):
        self.github = github_service

    async def detect_changes(self, owner: str, repo: str, base_sha: str, head_sha: str):
        """
        Compare two commits via GitHub API and normalize the changes.
        Returns a list of dicts: {'status': '...', 'old_path': '...', 'new_path': '...'}
        """
        try:
            comparison = await self.github.compare_commits(owner, repo, base_sha, head_sha)
            files = comparison.get("files", [])
        except Exception as e:
            logger.error(f"Failed to compare {base_sha}...{head_sha}: {e}")
            raise

        normalized = []
        for f in files:
            status = f.get("status")
            filename = f.get("filename")
            previous_filename = f.get("previous_filename", filename)

            # GitHub statuses: added, removed, modified, renamed, copied, changed, unchanged
            if status == "added":
                normalized.append({"status": "ADDED", "new_path": filename, "old_path": None})
            elif status == "removed":
                normalized.append({"status": "DELETED", "new_path": None, "old_path": filename})
            elif status == "modified" or status == "changed":
                normalized.append({"status": "MODIFIED", "new_path": filename, "old_path": filename})
            elif status == "renamed":
                normalized.append({"status": "RENAMED", "new_path": filename, "old_path": previous_filename})
            else:
                logger.warning(f"Unknown or ignored file status {status} for {filename}")

        return normalized
