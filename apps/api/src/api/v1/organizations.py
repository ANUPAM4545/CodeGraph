from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
import hashlib
import secrets

from src.db.session import get_db
from src.db.models.user import User
from src.db.models.organization import Organization, OrganizationMember, DeveloperApiKey
from src.services.security import get_current_user
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter()

class ApiKeyCreate(BaseModel):
    label: str

class ApiKeyResponse(BaseModel):
    id: str
    organization_id: str
    permissions: str
    created_at: datetime
    last_used_at: Optional[datetime] = None
    created_by: str
    
    class Config:
        from_attributes = True

class ApiKeyCreatedResponse(ApiKeyResponse):
    key: str # ONLY returned once on creation

def get_authorized_org_admin(org_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user.id,
        OrganizationMember.role.in_(["OWNER", "ADMIN"])
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized to manage API keys for this organization")
    return member

@router.post("/{org_id}/api-keys", response_model=ApiKeyCreatedResponse)
def create_api_key(
    org_id: str,
    payload: ApiKeyCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    auth_member: OrganizationMember = Depends(get_authorized_org_admin)
):
    # Generate raw key
    raw_key = f"cg_live_{secrets.token_urlsafe(32)}"
    
    # Hash the key for storage
    hashed_key = hashlib.sha256(raw_key.encode()).hexdigest()
    
    api_key = DeveloperApiKey(
        organization_id=org_id,
        hashed_key=hashed_key,
        permissions="ALL", # Can be scoped later
        created_by=user.id
    )
    
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    
    # Return the raw key ONLY THIS ONE TIME
    response = ApiKeyCreatedResponse(
        id=str(api_key.id),
        organization_id=str(api_key.organization_id),
        permissions=api_key.permissions,
        created_at=api_key.created_at,
        last_used_at=api_key.last_used_at,
        created_by=str(api_key.created_by),
        key=raw_key
    )
    
    return response

@router.get("/{org_id}/api-keys", response_model=List[ApiKeyResponse])
def list_api_keys(
    org_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    auth_member: OrganizationMember = Depends(get_authorized_org_admin)
):
    keys = db.query(DeveloperApiKey).filter(
        DeveloperApiKey.organization_id == org_id,
        DeveloperApiKey.revoked_at == None
    ).all()
    
    return [
        ApiKeyResponse(
            id=str(k.id),
            organization_id=str(k.organization_id),
            permissions=k.permissions,
            created_at=k.created_at,
            last_used_at=k.last_used_at,
            created_by=str(k.created_by)
        ) for k in keys
    ]

@router.delete("/{org_id}/api-keys/{key_id}", status_code=204)
def revoke_api_key(
    org_id: str,
    key_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    auth_member: OrganizationMember = Depends(get_authorized_org_admin)
):
    key = db.query(DeveloperApiKey).filter(
        DeveloperApiKey.id == key_id,
        DeveloperApiKey.organization_id == org_id
    ).first()
    
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
        
    key.revoked_at = datetime.utcnow()
    db.commit()
    return None
