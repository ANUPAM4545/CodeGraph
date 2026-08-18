from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.exc import IntegrityError
import uuid

from src.db.session import get_db
from src.db.models.user import User, ExternalIdentity
from src.db.models.repository import Repository
from src.services.security import get_current_user
from src.services.github import GitHubService

router = APIRouter()

class RepositoryDTO(BaseModel):
    id: str
    owner_id: Optional[str] = None
    name: str
    full_name: str
    description: Optional[str] = None
    visibility: str = "public"
    default_branch: str = "main"
    url: str
    status: str = "pending"
    latest_version_id: Optional[str] = None
    latest_commit_sha: Optional[str] = None
    error: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

def to_repo_dto(repo: Repository) -> RepositoryDTO:
    status = "pending"
    latest_version_id = None
    latest_commit_sha = None
    error = None

    if repo.versions:
        sorted_versions = sorted(repo.versions, key=lambda v: v.created_at or datetime.min, reverse=True)
        latest_ver = sorted_versions[0]
        status = latest_ver.status or "pending"
        latest_version_id = str(latest_ver.id)
        latest_commit_sha = latest_ver.commit_sha
        if latest_ver.jobs:
            sorted_jobs = sorted(latest_ver.jobs, key=lambda j: j.created_at or datetime.min, reverse=True)
            if sorted_jobs and sorted_jobs[0].error:
                error = sorted_jobs[0].error

    return RepositoryDTO(
        id=str(repo.id),
        owner_id=str(repo.owner_id) if repo.owner_id else None,
        name=repo.name,
        full_name=repo.full_name,
        description=repo.description,
        visibility=repo.visibility or "public",
        default_branch=repo.default_branch or "main",
        url=repo.url,
        status=status,
        latest_version_id=latest_version_id,
        latest_commit_sha=latest_commit_sha,
        error=error,
        created_at=repo.created_at,
        updated_at=repo.updated_at or repo.created_at
    )

def get_github_service(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    identity = db.query(ExternalIdentity).filter(
        ExternalIdentity.user_id == user.id, 
        ExternalIdentity.provider == "github"
    ).first()
    if not identity:
        # Fallback to unauthenticated client for public repositories
        return GitHubService(encrypted_token=None)
    return GitHubService(identity.encrypted_credentials)

@router.get("/github")
async def list_github_repositories(github: GitHubService = Depends(get_github_service)):
    repos = await github.list_repositories()
    return [{"id": r["id"], "full_name": r["full_name"], "name": r["name"], "visibility": r.get("visibility", "public")} for r in repos]

@router.get("", response_model=List[RepositoryDTO])
def list_repositories(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repos = db.query(Repository).filter(Repository.owner_id == user.id).all()
    return [to_repo_dto(r) for r in repos]

@router.get("/{repository_id}", response_model=RepositoryDTO)
def get_repository(repository_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if repository_id in ["demo", "default", "active", "latest"]:
        repo = db.query(Repository).filter(Repository.owner_id == user.id).order_by(Repository.created_at.desc()).first()
    else:
        try:
            repo_uuid = uuid.UUID(repository_id)
            repo = db.query(Repository).filter(Repository.id == repo_uuid, Repository.owner_id == user.id).first()
        except (ValueError, TypeError):
            repo = db.query(Repository).filter(
                (Repository.name == repository_id) | (Repository.full_name == repository_id),
                Repository.owner_id == user.id
            ).first()

    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    return to_repo_dto(repo)

@router.post("/import", response_model=RepositoryDTO)
async def import_repository(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db), github: GitHubService = Depends(get_github_service)):
    full_name = data.get("full_name")
    if not full_name:
        raise HTTPException(status_code=400, detail="full_name is required")
        
    owner, repo_name = full_name.split("/")
    
    # Check duplicate
    try:
        gh_repo = await github.get_repository(owner, repo_name)
        github_id_val = str(gh_repo["id"])
        url_val = gh_repo["html_url"]
        desc_val = gh_repo.get("description")
        visibility_val = gh_repo.get("visibility", "public")
        branch_val = gh_repo.get("default_branch", "main")
    except Exception:
        github_id_val = str(uuid.uuid4())
        url_val = f"https://github.com/{owner}/{repo_name}"
        desc_val = None
        visibility_val = "public"
        branch_val = "main"

    existing = db.query(Repository).filter(
        (Repository.github_id == github_id_val) | (Repository.full_name == full_name),
        Repository.owner_id == user.id
    ).first()
    if existing:
        return to_repo_dto(existing)
        
    repo = Repository(
        owner_id=user.id,
        github_id=github_id_val,
        name=repo_name,
        full_name=full_name,
        description=desc_val,
        visibility=visibility_val,
        default_branch=branch_val,
        url=url_val
    )
    db.add(repo)
    try:
        db.commit()
        db.refresh(repo)
    except IntegrityError:
        db.rollback()
        existing = db.query(Repository).filter(
            (Repository.github_id == github_id_val) | (Repository.full_name == full_name),
            Repository.owner_id == user.id
        ).first()
        if existing:
            return to_repo_dto(existing)
        raise HTTPException(status_code=400, detail="Repository already imported or database conflict")
    return to_repo_dto(repo)
