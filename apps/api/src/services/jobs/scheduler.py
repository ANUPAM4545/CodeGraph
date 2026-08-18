import logging
import uuid
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from src.db.models.job import AnalysisJob, JobExecution
from rq import Queue, Retry
from src.db.session import get_redis_client

logger = logging.getLogger(__name__)

class RetryPolicy:
    def __init__(self, max_attempts: int = 3, initial_delay: int = 60, max_delay: int = 3600, backoff_multiplier: int = 2):
        self.max_attempts = max_attempts
        self.initial_delay = initial_delay
        self.max_delay = max_delay
        self.backoff_multiplier = backoff_multiplier

class JobScheduler:
    def __init__(self, db: Session):
        self.db = db
        self.redis_conn = get_redis_client()
        # Define priority queues
        self.queues = {
            "HIGH": Queue("high_priority", connection=self.redis_conn),
            "NORMAL": Queue("normal_priority", connection=self.redis_conn),
            "LOW": Queue("low_priority", connection=self.redis_conn)
        }

    def schedule_analysis(self, repository_id: str, version_id: str, job_type: str, priority: str = "NORMAL", retry_policy: Optional[RetryPolicy] = None) -> str:
        """
        Schedules a stateless analysis worker job.
        """
        if priority not in self.queues:
            priority = "NORMAL"

        q = self.queues[priority]
        
        job_record = AnalysisJob(
            repository_id=repository_id,
            repository_version_id=version_id,
            job_type=job_type,
            status="QUEUED"
        )
        self.db.add(job_record)
        self.db.commit()
        self.db.refresh(job_record)
        
        # Determine retry args for RQ
        retry_kwargs = None
        if retry_policy:
            retry_kwargs = Retry(
                max=retry_policy.max_attempts, 
                intervals=[min(retry_policy.initial_delay * (retry_policy.backoff_multiplier ** i), retry_policy.max_delay) for i in range(retry_policy.max_attempts)]
            )
            
        # The worker will be stateless and read DB using job_id
        q.enqueue(
            'worker.execute_stateless_job',
            str(job_record.id),
            job_timeout=3600,
            retry=retry_kwargs
        )
        
        logger.info(f"Scheduled {job_type} job {job_record.id} with priority {priority}")
        return str(job_record.id)

    def record_execution_start(self, job_id: str, worker_id: str) -> str:
        execution = JobExecution(
            job_id=job_id,
            worker_id=worker_id,
            status="RUNNING"
        )
        self.db.add(execution)
        self.db.commit()
        self.db.refresh(execution)
        return str(execution.id)
        
    def record_execution_end(self, execution_id: str, status: str, error_summary: str = None):
        execution = self.db.query(JobExecution).filter(JobExecution.id == execution_id).first()
        if execution:
            execution.status = status
            execution.error_summary = error_summary
            from sqlalchemy import func
            execution.finished_at = func.now()
            self.db.commit()
