from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.core.config import settings
import redis
from neo4j import GraphDatabase
from qdrant_client import QdrantClient

# PostgreSQL
engine = create_engine(settings.sync_database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis
def get_redis_client():
    return redis.Redis(host=settings.REDIS_HOST, port=int(settings.REDIS_PORT), db=0)

# Neo4j
def get_neo4j_driver():
    return GraphDatabase.driver(
        settings.NEO4J_URI, 
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )

# Qdrant
def get_qdrant_client():
    return QdrantClient(host=settings.QDRANT_HOST, port=int(settings.QDRANT_PORT))
