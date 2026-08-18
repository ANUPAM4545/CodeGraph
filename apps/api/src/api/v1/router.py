from fastapi import APIRouter
from src.api.v1 import health, auth, repositories, analysis, graph, ai, webhooks, history, architecture, intelligence, ide, ws, organizations, analytics

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(repositories.router, prefix="/repositories", tags=["repositories"])
api_router.include_router(analysis.router, tags=["analysis"])
api_router.include_router(graph.router, prefix="/repositories", tags=["graph"])
api_router.include_router(ai.router, prefix="/repositories", tags=["ai"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(history.router, prefix="/repositories", tags=["history"])
api_router.include_router(architecture.router, prefix="/repositories", tags=["architecture"])
api_router.include_router(intelligence.router, prefix="/repositories", tags=["intelligence"])
api_router.include_router(ide.router, prefix="/repositories", tags=["ide"])
api_router.include_router(ws.router, prefix="/ws", tags=["websockets"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

