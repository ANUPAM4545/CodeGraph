import pytest
from src.services.analysis.change_detector import ChangeDetector

class MockGitHubService:
    async def compare_commits(self, owner, repo, base, head):
        return {
            "files": [
                {"filename": "src/main.py", "status": "modified"},
                {"filename": "src/utils.py", "status": "added"},
                {"filename": "src/old.py", "status": "removed"},
                {"filename": "src/new.py", "previous_filename": "src/old2.py", "status": "renamed"}
            ]
        }

@pytest.mark.asyncio
async def test_detect_changes():
    github = MockGitHubService()
    detector = ChangeDetector(github)
    
    changes = await detector.detect_changes("owner", "repo", "base", "head")
    
    assert len(changes) == 4
    
    mod = next(c for c in changes if c["new_path"] == "src/main.py")
    assert mod["status"] == "MODIFIED"
    assert mod["old_path"] == "src/main.py"
    
    add = next(c for c in changes if c["new_path"] == "src/utils.py")
    assert add["status"] == "ADDED"
    assert add["old_path"] is None
    
    rem = next(c for c in changes if c["old_path"] == "src/old.py")
    assert rem["status"] == "DELETED"
    assert rem["new_path"] is None
    
    ren = next(c for c in changes if c["status"] == "RENAMED")
    assert ren["old_path"] == "src/old2.py"
    assert ren["new_path"] == "src/new.py"
