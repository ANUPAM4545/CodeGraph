import asyncio
import json
import logging
from typing import Dict, Set, Optional
from fastapi import WebSocket
from src.schemas.realtime import RealtimeEvent
import redis.asyncio as redis
from src.core.config import settings

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Maps connection_id to WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        # Maps connection_id to user_id
        self.connection_user_map: Dict[str, str] = {}
        # Maps connection_id to set of channels
        self.connection_channels: Dict[str, Set[str]] = {}
        # Maps channel to set of connection_ids
        self.channel_subscribers: Dict[str, Set[str]] = {}
        
        self.redis: Optional[redis.Redis] = None
        self.pubsub: Optional[redis.client.PubSub] = None
        self._multiplexer_task: Optional[asyncio.Task] = None

    async def connect_redis(self):
        if not self.redis:
            try:
                self.redis = redis.from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}", decode_responses=True)
                self.pubsub = self.redis.pubsub()
                # Start multiplexer
                self._multiplexer_task = asyncio.create_task(self._redis_multiplexer())
                logger.info("Connected to Redis Pub/Sub multiplexer.")
            except Exception as e:
                logger.error(f"Failed to connect to Redis: {e}")

    async def disconnect_redis(self):
        if self._multiplexer_task:
            self._multiplexer_task.cancel()
        if self.pubsub:
            await self.pubsub.close()
        if self.redis:
            await self.redis.close()

    def get_channel_name(self, repo_id: str, version_id: str) -> str:
        return f"codegraph:repository:{repo_id}:version:{version_id}"

    async def register(self, websocket: WebSocket, connection_id: str, user_id: str):
        self.active_connections[connection_id] = websocket
        self.connection_user_map[connection_id] = user_id
        self.connection_channels[connection_id] = set()

    async def unregister(self, connection_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        if connection_id in self.connection_user_map:
            del self.connection_user_map[connection_id]
        
        channels = self.connection_channels.pop(connection_id, set())
        for channel in channels:
            subs = self.channel_subscribers.get(channel, set())
            subs.discard(connection_id)
            if not subs:
                self.channel_subscribers.pop(channel, None)
                if self.pubsub:
                    await self.pubsub.unsubscribe(channel)

    async def subscribe(self, connection_id: str, repo_id: str, version_id: str):
        channel = self.get_channel_name(repo_id, version_id)
        if connection_id not in self.connection_channels:
            return
            
        self.connection_channels[connection_id].add(channel)
        
        if channel not in self.channel_subscribers:
            self.channel_subscribers[channel] = set()
            if self.pubsub:
                await self.pubsub.subscribe(channel)
                
        self.channel_subscribers[channel].add(connection_id)
        logger.info(f"Connection {connection_id} subscribed to {channel}")

    async def publish_event(self, event: RealtimeEvent):
        if not self.redis:
            return
        channel = self.get_channel_name(event.repository_id, event.repository_version_id)
        payload = event.model_dump_json()
        await self.redis.publish(channel, payload)
        
    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception:
            pass

    async def _redis_multiplexer(self):
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    channel = message["channel"]
                    data = message["data"]
                    
                    subscribers = self.channel_subscribers.get(channel, set())
                    for conn_id in list(subscribers):
                        ws = self.active_connections.get(conn_id)
                        if ws:
                            try:
                                await ws.send_text(data)
                            except Exception:
                                await self.unregister(conn_id)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Redis multiplexer error: {e}")

manager = ConnectionManager()
