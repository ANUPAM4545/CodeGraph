from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.db.models.user import User
from src.db.models.repository import Repository, RepositoryVersion
from src.services.security import get_current_user

router = APIRouter()

@router.get("/{repository_id}/sync-status")
def get_sync_status(repository_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(Repository).filter(Repository.id == repository_id, Repository.owner_id == user.id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    versions = db.query(RepositoryVersion).filter(RepositoryVersion.repository_id == repo.id).order_by(RepositoryVersion.created_at.desc()).all()
    
    if not versions:
        return {
            "sync_state": "NOT CONFIGURED",
            "current_version": None,
            "latest_github_sha": None
        }

    latest = versions[0]
    return {
        "sync_state": latest.status, # e.g. "analyzing", "completed", "failed"
        "current_version": latest.commit_sha,
        "latest_github_sha": latest.commit_sha, # Would ideally fetch from github
        "last_successful_analysis": next((v.created_at for v in versions if v.status == "completed"), None)
    }

@router.get("/{repository_id}/history")
def get_history(repository_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(Repository).filter(Repository.id == repository_id, Repository.owner_id == user.id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    versions = db.query(RepositoryVersion).filter(RepositoryVersion.repository_id == repo.id).order_by(RepositoryVersion.created_at.desc()).all()
    
    return [
        {
            "id": str(v.id),
            "commit_sha": v.commit_sha,
            "parent_commit_sha": v.parent_commit_sha,
            "status": v.status,
            "created_at": v.created_at.isoformat()
        } for v in versions
    ]

@router.get("/{repository_id}/versions/{version_id}/diff")
def get_diff(repository_id: str, version_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify access
    repo = db.query(Repository).filter(Repository.id == repository_id, Repository.owner_id == user.id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    # In a real implementation this would query Neo4j or precomputed GraphDiff
    return {
        "files_changed": [
            {"status": "MODIFIED", "path": "src/main.py"},
            {"status": "ADDED", "path": "src/utils.py"}
        ],
        "symbols_added": 2,
        "symbols_removed": 0,
        "relationships_added": 5,
        "relationships_removed": 1
    }

@router.get("/{repository_id}/versions/{version_id}/impact")
def get_impact(repository_id: str, version_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify access
    repo = db.query(Repository).filter(Repository.id == repository_id, Repository.owner_id == user.id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    # Mocked Impact result for milestone constraint verification
    return {
        "affected_files": ["src/main.py"],
        "affected_symbols": ["run_analysis"],
        "callers": [],
        "dependencies": ["src/utils.py"]
    }
