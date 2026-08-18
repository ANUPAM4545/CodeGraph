import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from rq import Queue
import logging

from src.db.session import get_db, get_redis_client
from src.db.models.webhook import WebhookEvent
from src.db.models.job import AnalysisJob
from src.db.models.repository import Repository
import os

router = APIRouter()
logger = logging.getLogger(__name__)

GITHUB_WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "dummy_secret_for_tests")

def verify_github_signature(payload: bytes, signature_header: str) -> bool:
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    signature = signature_header.split("sha256=")[1]
    mac = hmac.new(GITHUB_WEBHOOK_SECRET.encode(), msg=payload, digestmod=hashlib.sha256)
    return hmac.compare_digest(mac.hexdigest(), signature)

@router.post("/github")
async def github_webhook(request: Request, db: Session = Depends(get_db)):
    payload_bytes = await request.body()
    signature = request.headers.get("X-Hub-Signature-256")
    delivery_id = request.headers.get("X-GitHub-Delivery")
    event_type = request.headers.get("X-GitHub-Event")

    if not delivery_id or not event_type:
        raise HTTPException(status_code=400, detail="Missing required GitHub headers")

    if not verify_github_signature(payload_bytes, signature):
        logger.warning(f"Invalid webhook signature for delivery {delivery_id}")
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = await request.json()
    
    # Store the WebhookEvent idempotently
    event = WebhookEvent(
        provider="github",
        delivery_id=delivery_id,
        event_type=event_type,
        payload=payload,
        status="pending"
    )
    db.add(event)
    try:
        db.commit()
        db.refresh(event)
    except IntegrityError:
        db.rollback()
        logger.info(f"Duplicate delivery ignored: {delivery_id}")
        return {"status": "ok", "message": "Duplicate delivery ignored"}

    # We only process push events for now
    if event_type != "push":
        event.status = "skipped"
        event.error = "Unsupported event type"
        db.commit()
        return {"status": "ok", "message": f"Event {event_type} ignored"}
        
    repository_external_id = str(payload.get("repository", {}).get("id"))
    if not repository_external_id:
        event.status = "failed"
        event.error = "Missing repository ID in payload"
        db.commit()
        raise HTTPException(status_code=400, detail="Missing repository identity")

    # Enqueue PROCESS_WEBHOOK job
    # Note: We need a generic job attached to a repository, not necessarily a version yet, 
    # since we determine version inside the job. For RQ, we can just enqueue the function directly.
    redis_conn = get_redis_client()
    q = Queue('webhook_tasks', connection=redis_conn)
    q.enqueue('worker.process_webhook', str(event.id), job_timeout=3600)
    
    return {"status": "ok", "message": "Event enqueued for processing"}
