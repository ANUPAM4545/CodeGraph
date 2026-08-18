from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.router import api_router
from src.core.config import settings
from contextlib import asynccontextmanager
from src.services.realtime.connection_manager import manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await manager.connect_redis()
    yield
    # Shutdown
    await manager.disconnect_redis()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "CodeGraph API"}
