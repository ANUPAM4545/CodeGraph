from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
import httpx
from sqlalchemy.orm import Session
import uuid
import secrets
import base64
import hashlib
from datetime import datetime, timezone
import json

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

# --- GITHUB OAUTH ---

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
        f"scope=read:user%20user:email&"
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
        
    redis_conn.delete(state_key)
    
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
            raise HTTPException(status_code=400, detail="Failed to exchange authorization code with GitHub")
            
        data = resp.json()
        access_token = data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token provided by GitHub")

    async with httpx.AsyncClient() as client:
        user_resp = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user profile from GitHub")
            
        gh_user = user_resp.json()
        gh_id = str(gh_user["id"])
        username = gh_user.get("login") or f"gh_{gh_id}"
        name = gh_user.get("name") or username
        email = gh_user.get("email")
        avatar_url = gh_user.get("avatar_url")

    # If email wasn't in public profile, fetch primary verified email from GitHub emails endpoint
    if not email:
        try:
            async with httpx.AsyncClient() as client:
                emails_resp = await client.get(
                    "https://api.github.com/user/emails",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                if emails_resp.status_code == 200:
                    emails_data = emails_resp.json()
                    for e in emails_data:
                        if e.get("primary") and e.get("verified"):
                            email = e.get("email")
                            break
        except Exception:
            pass

    identity = db.query(ExternalIdentity).filter(
        ExternalIdentity.provider == "github",
        ExternalIdentity.provider_user_id == gh_id
    ).first()

    encrypted_token = GitHubTokenCipher.encrypt(access_token)

    if identity:
        identity.encrypted_credentials = encrypted_token
        user = identity.user
        if name:
            user.name = name
        if avatar_url:
            user.avatar_url = avatar_url
        user.last_login_at = datetime.now(timezone.utc)
    else:
        # Check existing user by verified email for safe account linking
        user = None
        if email:
            user = db.query(User).filter(User.email == email).first()
            
        if not user:
            user = User(
                username=username,
                email=email,
                name=name,
                avatar_url=avatar_url,
                last_login_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            if not user.avatar_url and avatar_url:
                user.avatar_url = avatar_url
            if not user.name and name:
                user.name = name
            user.last_login_at = datetime.now(timezone.utc)

        identity = ExternalIdentity(
            user_id=user.id,
            provider="github",
            provider_user_id=gh_id,
            encrypted_credentials=encrypted_token
        )
        db.add(identity)
    
    db.commit()

    jwt_token = create_access_token({"sub": str(user.id)})
    
    response = Response(status_code=status.HTTP_200_OK)
    response.set_cookie(
        key="cg_session",
        value=jwt_token,
        httponly=True,
        secure=False, # Standard for local/dev HTTP
        samesite="lax",
        max_age=settings.JWT_EXPIRE_MINUTES * 60,
        path="/"
    )
    
    user_payload = {
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url
        }
    }
    response.body = json.dumps(user_payload).encode()
    response.headers["Content-Type"] = "application/json"
    
    return response

# --- GOOGLE OAUTH ---

@router.get("/login/google")
async def login_google():
    state = secrets.token_urlsafe(32)
    code_verifier, code_challenge = generate_pkce()
    
    redis_conn = get_redis_client()
    redis_conn.setex(f"oauth_state:{state}", 300, code_verifier)
    
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={settings.GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"state={state}&"
        f"code_challenge={code_challenge}&"
        f"code_challenge_method=S256"
    )
    return {"url": url}

@router.post("/callback/google")
async def google_callback(request: Request, db: Session = Depends(get_db)):
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
        
    redis_conn.delete(state_key)
    
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://oauth2.googleapis.com/token",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "code_verifier": code_verifier.decode('utf-8')
            }
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange authorization code with Google")
            
        data = resp.json()
        access_token = data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token provided by Google")

    async with httpx.AsyncClient() as client:
        user_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user profile from Google")
            
        g_user = user_resp.json()
        g_id = str(g_user["id"])
        email = g_user.get("email")
        verified_email = g_user.get("verified_email", False)
        name = g_user.get("name") or g_user.get("given_name") or email.split("@")[0]
        avatar_url = g_user.get("picture")
        username = email.split("@")[0] if email else f"g_{g_id}"

    identity = db.query(ExternalIdentity).filter(
        ExternalIdentity.provider == "google",
        ExternalIdentity.provider_user_id == g_id
    ).first()

    encrypted_token = GitHubTokenCipher.encrypt(access_token)

    if identity:
        identity.encrypted_credentials = encrypted_token
        user = identity.user
        if name:
            user.name = name
        if avatar_url:
            user.avatar_url = avatar_url
        user.last_login_at = datetime.now(timezone.utc)
    else:
        # Safe account linking: Only link if Google email is strictly verified
        user = None
        if email and verified_email:
            user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(
                username=username,
                email=email,
                name=name,
                avatar_url=avatar_url,
                last_login_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            if not user.avatar_url and avatar_url:
                user.avatar_url = avatar_url
            if not user.name and name:
                user.name = name
            user.last_login_at = datetime.now(timezone.utc)

        identity = ExternalIdentity(
            user_id=user.id,
            provider="google",
            provider_user_id=g_id,
            encrypted_credentials=encrypted_token
        )
        db.add(identity)

    db.commit()

    jwt_token = create_access_token({"sub": str(user.id)})
    
    response = Response(status_code=status.HTTP_200_OK)
    response.set_cookie(
        key="cg_session",
        value=jwt_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.JWT_EXPIRE_MINUTES * 60,
        path="/"
    )
    
    user_payload = {
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url
        }
    }
    response.body = json.dumps(user_payload).encode()
    response.headers["Content-Type"] = "application/json"
    
    return response

# --- LOGOUT & USER INFO ---

@router.post("/logout")
async def logout():
    response = Response(status_code=status.HTTP_200_OK)
    response.delete_cookie(key="cg_session", path="/")
    response.body = json.dumps({"status": "logged_out"}).encode()
    response.headers["Content-Type"] = "application/json"
    return response

@router.get("/me")
async def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
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
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url
        },
        "organization": org_data,
        "permissions": []
    }
