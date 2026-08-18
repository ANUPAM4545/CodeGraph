import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, func, Float, Index, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.db.models.base import Base

class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"
    
    __table_args__ = (
        Index('uq_job_version_type_active', 'repository_version_id', 'job_type', 
              unique=True, 
              postgresql_where=text("status IN ('PENDING', 'QUEUED', 'RUNNING')")),
    )
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repository_id = Column(UUID(as_uuid=True), ForeignKey("repositories.id"), nullable=False)
    repository_version_id = Column(UUID(as_uuid=True), ForeignKey("repository_versions.id"), nullable=False)
    
    job_type = Column(String, default="full_analysis")
    status = Column(String, default="PENDING") # PENDING, QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
    progress = Column(Float, default=0.0)
    error = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    repository = relationship("Repository", back_populates="jobs")
    repository_version = relationship("RepositoryVersion", back_populates="jobs")
    executions = relationship("JobExecution", back_populates="job", cascade="all, delete-orphan")

class JobExecution(Base):
    __tablename__ = "job_executions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("analysis_jobs.id"), nullable=False, index=True)
    worker_id = Column(String, nullable=True)
    status = Column(String, default="RUNNING") # RUNNING, COMPLETED, FAILED
    error_code = Column(String, nullable=True)
    error_summary = Column(String, nullable=True)
    duration_ms = Column(Float, nullable=True)
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)

    job = relationship("AnalysisJob", back_populates="executions")
