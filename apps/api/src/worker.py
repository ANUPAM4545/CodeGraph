import logging
from sqlalchemy.orm import Session
from src.db.session import SessionLocal
from src.db.models.webhook import WebhookEvent
from src.db.models.repository import Repository, RepositoryVersion
from src.db.models.job import AnalysisJob
from src.services.github import GitHubService
from src.services.analysis.change_detector import ChangeDetector
from rq import Queue
from src.db.session import get_redis_client

logger = logging.getLogger(__name__)

INCREMENTAL_CHANGE_THRESHOLD_PERCENT = 0.20 # 20%

def process_webhook(event_id: str):
    """
    Job to process the webhook event.
    """
    db: Session = SessionLocal()
    try:
        event = db.query(WebhookEvent).filter(WebhookEvent.id == event_id).first()
        if not event:
            logger.error(f"WebhookEvent {event_id} not found")
            return
            
        payload = event.payload
        repository_external_id = str(payload.get("repository", {}).get("id"))
        
        # Match github repo id to our repo
        repo = db.query(Repository).filter(Repository.github_id == repository_external_id).first()
        if not repo:
            logger.error(f"Repository {repository_external_id} not found in DB")
            event.status = "failed"
            event.error = "Unknown repository"
            db.commit()
            return
            
        after_sha = payload.get("after")
        before_sha = payload.get("before")
        
        # Verify the parent version exists in our DB
        parent_version = db.query(RepositoryVersion).filter(
            RepositoryVersion.repository_id == repo.id,
            RepositoryVersion.commit_sha == before_sha
        ).first()
        
        analysis_mode = "INCREMENTAL_ANALYSIS"
        
        if not parent_version or parent_version.status != "completed":
            logger.warning(f"Parent version {before_sha} not found or not ready. Falling back to FULL_ANALYSIS.")
            analysis_mode = "full_analysis"
            
        # Create new RepositoryVersion
        new_version = RepositoryVersion(
            repository_id=repo.id,
            commit_sha=after_sha,
            parent_commit_sha=before_sha if parent_version else None,
            branch=payload.get("ref", "").replace("refs/heads/", ""),
            status="analyzing"
        )
        db.add(new_version)
        db.commit()
        db.refresh(new_version)
        
        # Create Job
        job = AnalysisJob(
            repository_id=repo.id,
            repository_version_id=new_version.id,
            job_type=analysis_mode,
            status="QUEUED"
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Enqueue analysis
        redis_conn = get_redis_client()
        q = Queue('analysis_tasks', connection=redis_conn)
        q.enqueue('src.worker.run_analysis', str(job.id), job_timeout=3600)
            
        event.status = "processed"
        db.commit()
        
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        db.rollback()
    finally:
        db.close()

def run_incremental_analysis(job_id: str):
    logger.info(f"Delegating incremental analysis for job {job_id} to canonical worker")
    from services.analysis.worker import run_analysis as canonical_run_analysis
    canonical_run_analysis(job_id)

def run_analysis(job_id: str):
    logger.info(f"Running full analysis for job {job_id}")
    from services.analysis.worker import run_analysis as canonical_run_analysis
    canonical_run_analysis(job_id)

def execute_stateless_job(job_id: str):
    """
    Stateless worker execution for Enterprise scale.
    """
    import os
    worker_id = os.getenv("WORKER_ID", f"worker-{os.getpid()}")
    logger.info(f"Worker {worker_id} starting stateless job {job_id}")
    
    db: Session = SessionLocal()
    from src.services.jobs.scheduler import JobScheduler
    scheduler = JobScheduler(db)
    
    execution_id = scheduler.record_execution_start(job_id, worker_id)
    
    try:
        from services.analysis.worker import run_analysis as canonical_run_analysis
        canonical_run_analysis(job_id)
        scheduler.record_execution_end(execution_id, "COMPLETED")
    except Exception as e:
        logger.error(f"Stateless job failed: {e}")
        scheduler.record_execution_end(execution_id, "FAILED", error_summary=str(e))
        raise
    finally:
        db.close()
