import uuid
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.services.security import get_current_user
from src.db.models.user import User
from src.db.models.repository import Repository, RepositoryVersion

def get_authorized_repository_version(
    repository_id: str,
    version_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> RepositoryVersion:
    """
    Validates that the requested repository belongs to the authenticated user,
    and the requested version belongs to the repository.
    Handles aliases like 'demo', 'active', 'latest' gracefully.
    """
    repo = None

    if repository_id in ["demo", "default", "active", "latest"]:
        repo = db.query(Repository).filter(
            Repository.owner_id == user.id
        ).order_by(Repository.created_at.desc()).first()
    else:
        try:
            repo_uuid = uuid.UUID(repository_id)
            repo = db.query(Repository).filter(
                Repository.id == repo_uuid,
                Repository.owner_id == user.id
            ).first()
        except (ValueError, TypeError):
            repo = db.query(Repository).filter(
                (Repository.name == repository_id) | (Repository.full_name == repository_id),
                Repository.owner_id == user.id
            ).first()

    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
        
    if version_id in ["latest", "current", "head"]:
        version = db.query(RepositoryVersion).filter(
            RepositoryVersion.repository_id == repo.id
        ).order_by(RepositoryVersion.created_at.desc()).first()
    else:
        try:
            ver_uuid = uuid.UUID(version_id)
            version = db.query(RepositoryVersion).filter(
                RepositoryVersion.id == ver_uuid,
                RepositoryVersion.repository_id == repo.id
            ).first()
        except (ValueError, TypeError):
            version = db.query(RepositoryVersion).filter(
                RepositoryVersion.commit_sha == version_id,
                RepositoryVersion.repository_id == repo.id
            ).first()
    
    if not version:
        raise HTTPException(status_code=404, detail="Repository version not found")
        
    return version
