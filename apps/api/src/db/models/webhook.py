import uuid
from sqlalchemy import Column, String, DateTime, func, UniqueConstraint, JSON
from sqlalchemy.dialects.postgresql import UUID
from src.db.models.base import Base

class WebhookEvent(Base):
    __tablename__ = "webhook_events"
    
    __table_args__ = (
        UniqueConstraint('provider', 'delivery_id', name='uq_webhook_provider_delivery'),
    )
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String, nullable=False, index=True) # e.g. "github"
    delivery_id = Column(String, nullable=False, index=True)
    event_type = Column(String, nullable=False) # e.g. "push"
    payload = Column(JSON, nullable=False)
    
    status = Column(String, default="pending") # pending, processed, failed, skipped
    error = Column(String, nullable=True)
    
    received_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
