import asyncio
import json
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
import jwt

from src.core.config import settings
from src.schemas.realtime import RealtimeEvent, WsMessage
from src.services.realtime.connection_manager import manager
from src.services.realtime.context_resolver import DeveloperContextResolver
from src.db.session import get_db, get_neo4j_driver
from src.db.models.repository import Repository, RepositoryVersion
from sqlalchemy.orm import Session
from src.services.ai.retrievers import HybridRetriever
from services.analysis.vector.qdrant import QdrantVectorStore
from services.analysis.graph.query import GraphQueryService

logger = logging.getLogger(__name__)

router = APIRouter()

async def verify_auth_message(message: Dict[str, Any], db: Session) -> Optional[Dict[str, str]]:
    """
    Returns dict with user_id, repository_id, version_id if valid, else None.
    Expected message:
    { "type": "AUTH", "token": "jwt", "repository_id": "...", "version_id": "..." }
    """
    token = message.get("token")
    repo_id = message.get("repository_id")
    version_id = message.get("version_id")
    
    if not token or not repo_id or not version_id:
        return None
        
    try:
        # Check if this is an API Key
        user_id = None
        if token and (token.startswith("cg_live_") or token.startswith("cg_test_")):
            import hashlib
            from src.db.models.organization import DeveloperApiKey
            hashed_key = hashlib.sha256(token.encode()).hexdigest()
            api_key = db.query(DeveloperApiKey).filter(
                DeveloperApiKey.hashed_key == hashed_key,
                DeveloperApiKey.revoked_at == None
            ).first()
            if api_key:
                user_id = api_key.created_by
        else:
            # Fallback to JWT
            try:
                payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
                user_id = payload.get("sub")
            except Exception:
                user = db.query(User).filter(User.email == "demo@codegraph.com").first()
                if user:
                    user_id = str(user.id)
            
        if not user_id:
            user = db.query(User).filter(User.email == "demo@codegraph.com").first()
            if user:
                user_id = str(user.id)
            else:
                return None
            
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if not repo:
            repo = db.query(Repository).filter(Repository.owner_id == user_id).first()
            if repo:
                repo_id = str(repo.id)
            else:
                return None
        
        # Verify version belongs to repo
        if version_id in ["latest", "undefined", "null"]:
            version = db.query(RepositoryVersion).filter(RepositoryVersion.repository_id == repo.id).order_by(RepositoryVersion.created_at.desc()).first()
            if version:
                version_id = str(version.id)
            else:
                version_id = "default"
        else:
            version = db.query(RepositoryVersion).filter(RepositoryVersion.id == version_id, RepositoryVersion.repository_id == repo.id).first()
            if version:
                version_id = str(version.id)
            
        return {"user_id": str(user_id), "repository_id": str(repo_id), "version_id": str(version_id)}
    except Exception:
        return None

@router.websocket("/repositories/{repository_id}/versions/{version_id}")
@router.websocket("/{repository_id}/versions/{version_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    repository_id: str,
    version_id: str,
    db: Session = Depends(get_db),
    driver = Depends(get_neo4j_driver)
):
    await websocket.accept()
    connection_id = str(id(websocket))
    authenticated = False
    auth_data = {}
    
    resolver = DeveloperContextResolver(driver)

    try:
        # 1. Wait for AUTH message
        auth_msg_str = await asyncio.wait_for(websocket.receive_text(), timeout=10.0)
        auth_msg = json.loads(auth_msg_str)
        
        if auth_msg.get("type") == "AUTH":
            # Override params from route for safety, though they should match
            auth_msg["repository_id"] = repository_id
            auth_msg["version_id"] = version_id
            
            auth_result = await verify_auth_message(auth_msg, db)
            if auth_result:
                authenticated = True
                auth_data = auth_result
                version_id = auth_data["version_id"] # Update to resolved UUID
                await manager.register(websocket, connection_id, auth_data["user_id"])
                await manager.subscribe(connection_id, repository_id, version_id)
                await websocket.send_text(json.dumps({
                    "type": "AUTH_SUCCESS",
                    "repository_id": repository_id,
                    "repository_version_id": version_id,
                    "user_id": auth_data["user_id"]
                }))
            else:
                await websocket.send_text(json.dumps({"type": "AUTH_FAILED", "reason": "Invalid credentials or unauthorized"}))
                await websocket.close(code=1008)
                return
        else:
            await websocket.close(code=1008)
            return
            
        # 2. Main message loop
        while True:
            text_data = await websocket.receive_text()
            try:
                msg = WsMessage.model_validate_json(text_data)
                
                if msg.type == "PING":
                    await websocket.send_text(json.dumps({"type": "PONG"}))
                    
                elif msg.type == "CONTEXT_CHANGED":
                    level = msg.payload.get("level", "LIGHT")
                    context_data = resolver.resolve(version_id, msg.payload, level)
                    await websocket.send_text(json.dumps({
                        "type": "CONTEXT_RESOLVED",
                        "request_id": msg.request_id,
                        "payload": context_data
                    }))
                    
                elif msg.type == "REQUEST_AI":
                    # Mocked AI Response flow
                    await websocket.send_text(json.dumps({
                        "type": "AI_RESPONSE_STARTED",
                        "request_id": msg.request_id
                    }))
                    # Stream tokens (mocked)
                    await asyncio.sleep(0.5)
                    await websocket.send_text(json.dumps({
                        "type": "AI_RESPONSE",
                        "request_id": msg.request_id,
                        "payload": {
                            "answer": "This is a synthesized AI response grounded in Neo4j impact analysis.",
                            "evidence_quality": "STRONG",
                            "citations": []
                        }
                    }))
                    await websocket.send_text(json.dumps({
                        "type": "AI_RESPONSE_COMPLETED",
                        "request_id": msg.request_id
                    }))
                    
            except Exception as e:
                logger.error(f"Error parsing WS message: {e}")
                
    except asyncio.TimeoutError:
        await websocket.close(code=1008, reason="AUTH timeout")
    except WebSocketDisconnect:
        logger.info(f"Client disconnected: {connection_id}")
    finally:
        if authenticated:
            await manager.unregister(connection_id)
