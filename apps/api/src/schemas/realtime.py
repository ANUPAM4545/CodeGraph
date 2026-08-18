from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, List
from datetime import datetime
from uuid import uuid4

class RealtimeEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid4()))
    event_version: int = Field(default=1)
    event_type: str
    repository_id: str
    repository_version_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    payload: Dict[str, Any]

class DeveloperSession(BaseModel):
    session_id: str
    user_id: str
    repository_id: str
    repository_version_id: str
    ide_type: Optional[str] = None
    workspace: Optional[str] = None
    current_file: Optional[str] = None
    current_symbol: Optional[str] = None
    cursor_position: Optional[Dict[str, int]] = None
    last_seen: datetime = Field(default_factory=datetime.utcnow)
    connection_status: str = "CONNECTED"

class WsMessage(BaseModel):
    """
    Message model strictly for WebSocket client/server interactions (e.g. AUTH, REQUEST_AI, etc)
    """
    type: str
    request_id: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)
