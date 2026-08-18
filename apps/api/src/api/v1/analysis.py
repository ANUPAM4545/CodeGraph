from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from rq import Queue
from redis import Redis
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy.exc import IntegrityError
import uuid

from src.db.session import get_db, get_redis_client
from src.db.models.user import User
from src.db.models.repository import Repository, RepositoryVersion
from src.db.models.job import AnalysisJob
from src.services.security import get_current_user
from src.services.github import GitHubService
from src.api.v1.repositories import get_github_service

router = APIRouter()

class AnalysisJobDTO(BaseModel):
    id: str
    repository_id: str
    repository_version_id: str
    job_type: str
    status: str
    progress: float = 0.0
    error: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

def to_job_dto(job: AnalysisJob) -> AnalysisJobDTO:
    return AnalysisJobDTO(
        id=str(job.id),
        repository_id=str(job.repository_id),
        repository_version_id=str(job.repository_version_id),
        job_type=job.job_type or "full_analysis",
        status=job.status,
        progress=job.progress or 0.0,
        error=job.error,
        created_at=job.created_at
    )

@router.post("/repositories/{repository_id}/analysis", response_model=AnalysisJobDTO)
async def start_analysis(
    repository_id: str, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db),
    github: GitHubService = Depends(get_github_service)
):
    repo = None
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

    # Fetch latest commit from GitHub to create a RepositoryVersion
    owner, repo_name = repo.full_name.split("/")
    branch = repo.default_branch or "main"
    try:
        commit_data = await github.get_latest_commit(owner, repo_name, branch)
        commit_sha = commit_data.get("sha") or branch
    except Exception:
        commit_sha = branch
    
    # Idempotency check: find version
    existing_version = db.query(RepositoryVersion).filter(
        RepositoryVersion.repository_id == repo.id,
        RepositoryVersion.commit_sha == commit_sha
    ).first()
    
    if not existing_version:
        existing_version = RepositoryVersion(
            repository_id=repo.id,
            commit_sha=commit_sha,
            branch=branch,
            status="pending"
        )
        db.add(existing_version)
        db.commit()
        db.refresh(existing_version)
    elif existing_version.status == "failed":
        existing_version.status = "pending"
        db.commit()

    # Idempotency check: check active jobs
    active_job = db.query(AnalysisJob).filter(
        AnalysisJob.repository_version_id == existing_version.id,
        AnalysisJob.status.in_(["PENDING", "QUEUED", "RUNNING"])
    ).first()
    if active_job:
        return to_job_dto(active_job)

    job = AnalysisJob(
        repository_id=repo.id,
        repository_version_id=existing_version.id,
        status="PENDING",
        job_type="full_analysis"
    )
    db.add(job)
    try:
        db.commit()
        db.refresh(job)
    except IntegrityError:
        db.rollback()
        # If there's an existing job that was FAILED or CANCELLED, reset it
        existing_job = db.query(AnalysisJob).filter(
            AnalysisJob.repository_version_id == existing_version.id,
            AnalysisJob.job_type == "full_analysis"
        ).order_by(AnalysisJob.created_at.desc()).first()
        if existing_job:
            existing_job.status = "PENDING"
            existing_job.error = None
            existing_job.progress = 0.0
            db.commit()
            db.refresh(existing_job)
            job = existing_job
        else:
            raise HTTPException(status_code=400, detail="Unable to start analysis job")

    # Queue job
    try:
        redis_conn = get_redis_client()
        q = Queue('analysis_tasks', connection=redis_conn)
        q.enqueue('src.worker.run_analysis', str(job.id), job_timeout=3600)
    except Exception as ex:
        print(f"Warning: unable to enqueue task to redis: {ex}")
    
    job.status = "QUEUED"
    db.commit()
    db.refresh(job)
    
    return to_job_dto(job)

@router.get("/analysis/{job_id}", response_model=AnalysisJobDTO)
def get_job_status(job_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = None
    try:
        j_uuid = uuid.UUID(job_id)
        job = db.query(AnalysisJob).join(Repository).filter(AnalysisJob.id == j_uuid, Repository.owner_id == user.id).first()
    except Exception:
        pass

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return to_job_dto(job)
