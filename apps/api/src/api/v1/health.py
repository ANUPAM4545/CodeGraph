from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.session import get_db, get_redis_client, get_neo4j_driver, get_qdrant_client

router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    status = {
        "status": "ok",
        "services": {
            "postgres": "down",
            "redis": "down",
            "neo4j": "down",
            "qdrant": "down"
        }
    }
    
    # Check Postgres
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        status["services"]["postgres"] = "up"
    except Exception as e:
        pass

    # Check Redis
    try:
        redis_client = get_redis_client()
        if redis_client.ping():
            status["services"]["redis"] = "up"
    except Exception:
        pass
        
    # Check Neo4j
    try:
        driver = get_neo4j_driver()
        driver.verify_connectivity()
        status["services"]["neo4j"] = "up"
        driver.close()
    except Exception:
        pass
        
    # Check Qdrant
    try:
        qdrant = get_qdrant_client()
        # Qdrant client usually doesn't throw unless it hits an endpoint, just a basic check
        qdrant.get_collections()
        status["services"]["qdrant"] = "up"
    except Exception:
        pass

    return status
