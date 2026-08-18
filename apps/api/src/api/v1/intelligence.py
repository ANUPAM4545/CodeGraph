# pyrefly: ignore-all-errors
# type: ignore
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import neo4j
from dataclasses import asdict

from src.db.session import get_db
from src.db.models.user import User, ExternalIdentity
from src.db.models.repository import Repository, RepositoryVersion
from src.api.deps import get_authorized_repository_version
from src.services.security import get_current_user, GitHubTokenCipher
from src.core.config import settings
from src.services.intelligence import RepositoryIntelligenceService

router = APIRouter()

def get_neo4j_driver():
    driver = neo4j.GraphDatabase.driver(
        uri=settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )
    try:
        yield driver
    finally:
        driver.close()

@router.get("/{repository_id}/versions/{version_id}/intelligence")
async def get_repository_intelligence(
    repository_id: str,
    version_id: str,
    version: RepositoryVersion = Depends(get_authorized_repository_version),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    driver = Depends(get_neo4j_driver)
):
    """
    Returns complete real-time intelligence for the requested repository and version.
    Strictly isolated to authorized organization and repository version.
    """
    repo = db.query(Repository).filter(Repository.id == version.repository_id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    # Get user token if available
    identity = db.query(ExternalIdentity).filter(
        ExternalIdentity.user_id == user.id,
        ExternalIdentity.provider == "github"
    ).first()
    token = None
    if identity and identity.encrypted_credentials:
        try:
            token = GitHubTokenCipher.decrypt(identity.encrypted_credentials)
        except Exception:
            token = None

    service = RepositoryIntelligenceService(neo4j_driver=driver, github_token=token)
    try:
        intelligence = await service.get_intelligence(repo, version)
        return asdict(intelligence)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate intelligence: {str(e)}")
