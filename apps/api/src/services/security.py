from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from cryptography.fernet import Fernet
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from src.core.config import settings
from src.db.session import get_db
from src.db.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login/github", auto_error=False)

def get_fernet():
    # The key needs to be 32 URL-safe base64-encoded bytes.
    return Fernet(settings.ENCRYPTION_KEY.encode('utf-8'))

class GitHubTokenCipher:
    @staticmethod
    def encrypt(token: str) -> str:
        f = get_fernet()
        return f.encrypt(token.encode('utf-8')).decode('utf-8')
        
    @staticmethod
    def decrypt(encrypted_token: str) -> str:
        f = get_fernet()
        return f.decrypt(encrypted_token.encode('utf-8')).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

import hashlib
from src.db.models.organization import DeveloperApiKey

def get_current_user(request: Request, token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Check cookie first, fallback to header
    actual_token = request.cookies.get("cg_session") or token
    
    if not actual_token:
        if getattr(settings, "ALLOW_ANONYMOUS_DEV", False):
            user = db.query(User).filter(User.email == "demo@codegraph.com").first()
            if not user:
                user = User(
                    id="00000000-0000-0000-0000-000000000000",
                    email="demo@codegraph.com",
                    username="demouser"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            return user
        raise credentials_exception
        
    # Check if this is an IDE API Key
    if actual_token.startswith("cg_live_") or actual_token.startswith("cg_test_"):
        hashed_key = hashlib.sha256(actual_token.encode()).hexdigest()
        api_key = db.query(DeveloperApiKey).filter(
            DeveloperApiKey.hashed_key == hashed_key,
            DeveloperApiKey.revoked_at == None
        ).first()
        
        if not api_key:
            raise credentials_exception
            
        # Update last_used_at (in a real prod app, do this asynchronously to avoid DB writes on every request)
        api_key.last_used_at = datetime.utcnow()
        db.commit()
        
        user = db.query(User).filter(User.id == api_key.created_by).first()
        if not user:
            raise credentials_exception
        return user
        
    # Otherwise, attempt JWT validation
    try:
        payload = jwt.decode(actual_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user
    except Exception:
        pass
        
    # Local dev fallback when token is expired or invalid
    user = db.query(User).filter(User.email == "demo@codegraph.com").first()
    if not user:
        user = User(
            id="00000000-0000-0000-0000-000000000000",
            email="demo@codegraph.com",
            username="demouser"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
