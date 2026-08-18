from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
import httpx
from sqlalchemy.orm import Session
import uuid
import secrets
import base64
import hashlib

from src.core.config import settings
from src.db.session import get_db, get_redis_client
from src.db.models.user import User, ExternalIdentity
from src.services.security import GitHubTokenCipher, create_access_token, get_current_user

router = APIRouter()

def generate_pkce():
    code_verifier = secrets.token_urlsafe(64)
    hashed = hashlib.sha256(code_verifier.encode('ascii')).digest()
    code_challenge = base64.urlsafe_b64encode(hashed).decode('ascii').rstrip('=')
    return code_verifier, code_challenge

@router.get("/login/github")
async def login_github():
    state = secrets.token_urlsafe(32)
    code_verifier, code_challenge = generate_pkce()
    
    redis_conn = get_redis_client()
    redis_conn.setex(f"oauth_state:{state}", 300, code_verifier) # 5 minutes TTL
    
    url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={settings.GITHUB_CLIENT_ID}&"
        f"redirect_uri={settings.GITHUB_REDIRECT_URI}&"
        f"state={state}&"
        f"code_challenge={code_challenge}&"
        f"code_challenge_method=S256"
    )
    return {"url": url}

@router.post("/callback/github")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    code = body.get("code")
    state = body.get("state")
    
    if not state or not code:
        raise HTTPException(status_code=400, detail="Missing state or code")

    redis_conn = get_redis_client()
    state_key = f"oauth_state:{state}"
    code_verifier = redis_conn.get(state_key)
    
    if not code_verifier:
        raise HTTPException(status_code=400, detail="Invalid or expired state parameter")
        
    # Delete state immediately to prevent reuse (single-use)
    redis_conn.delete(state_key)
    
    # Exchange code for access token using PKCE verifier
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
                "code_verifier": code_verifier.decode('utf-8')
            }
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code")
            
        data = resp.json()
        access_token = data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token provided by GitHub")

    # Fetch user identity
    async with httpx.AsyncClient() as client:
        user_resp = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user from GitHub")
            
        gh_user = user_resp.json()
        gh_id = str(gh_user["id"])
        username = gh_user.get("login")
        email = gh_user.get("email")

    # Check if identity exists
    identity = db.query(ExternalIdentity).filter(
        ExternalIdentity.provider == "github",
        ExternalIdentity.provider_user_id == gh_id
    ).first()

    encrypted_token = GitHubTokenCipher.encrypt(access_token)

    if identity:
        identity.encrypted_credentials = encrypted_token
        user = identity.user
    else:
        # Create user and identity
        user = User(username=username, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        
        identity = ExternalIdentity(
            user_id=user.id,
            provider="github",
            provider_user_id=gh_id,
            encrypted_credentials=encrypted_token
        )
        db.add(identity)
    
    db.commit()

    # Create JWT
    jwt_token = create_access_token({"sub": str(user.id)})
    
    # We use FastAPI Response to set the cookie
    from fastapi import Response
    response = Response(status_code=status.HTTP_200_OK)
    response.set_cookie(
        key="cg_session",
        value=jwt_token,
        httponly=True,
        secure=False, # True in prod via env check usually, setting False for local dev
        samesite="lax",
        max_age=settings.JWT_EXPIRE_MINUTES * 60,
        path="/"
    )
    
    # Return user data but NOT the token in body
    import json
    response.body = json.dumps({"user": {"id": str(user.id), "username": user.username}}).encode()
    response.headers["Content-Type"] = "application/json"
    
    return response

@router.get("/me")
async def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        
    # Find active organization for user
    from src.db.models.organization import OrganizationMember, Organization
    member = db.query(OrganizationMember).filter(OrganizationMember.user_id == user.id).first()
    
    org_data = None
    if member:
        org = db.query(Organization).filter(Organization.id == member.organization_id).first()
        if org:
            org_data = {
                "id": str(org.id),
                "name": org.name,
                "role": member.role.name if hasattr(member.role, 'name') else str(member.role)
            }
            
    return {
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email
        },
        "organization": org_data,
        "permissions": [] # RBAC permissions can be expanded here
    }

