import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, func, Boolean, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.db.models.base import Base

class Repository(Base):
    __tablename__ = "repositories"
    
    __table_args__ = (
        UniqueConstraint('organization_id', 'github_id', name='uq_repo_org_github'),
    )
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # Temporarily nullable for migration
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True, index=True) # Temporarily nullable
    github_id = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    visibility = Column(String, nullable=False, default="public")
    default_branch = Column(String, nullable=False, default="main")
    url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_synced_at = Column(DateTime(timezone=True), nullable=True)

    owner = relationship("User", back_populates="repositories")
    organization = relationship("Organization", back_populates="repositories")
    versions = relationship("RepositoryVersion", back_populates="repository", cascade="all, delete-orphan")
    jobs = relationship("AnalysisJob", back_populates="repository", cascade="all, delete-orphan")

class RepositoryVersion(Base):
    __tablename__ = "repository_versions"
    
    __table_args__ = (
        UniqueConstraint('repository_id', 'commit_sha', name='uq_repo_version_commit_sha'),
    )
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repository_id = Column(UUID(as_uuid=True), ForeignKey("repositories.id"), nullable=False)
    commit_sha = Column(String, nullable=False)
    parent_commit_sha = Column(String, nullable=True)
    branch = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, analyzing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    repository = relationship("Repository", back_populates="versions")
    jobs = relationship("AnalysisJob", back_populates="repository_version", cascade="all, delete-orphan")

