from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CodeGraph API"
    API_V1_STR: str = "/api/v1"
    
    # DB
    POSTGRES_USER: str = "codegraph"
    POSTGRES_PASSWORD: str = "codegraph_password"
    POSTGRES_DB: str = "codegraph_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    
    # Graph DB
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "codegraph_neo4j"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: str = "6379"
    
    # Vector DB
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: str = "6333"

    # Security
    JWT_SECRET: str = "super_secret_jwt_key_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    ENCRYPTION_KEY: str = "super_secret_32_byte_encryption_key_change_in_prod=" # Must be 32 URL-safe base64-encoded bytes
    ALLOW_ANONYMOUS_DEV: bool = False

    # GitHub OAuth
    GITHUB_CLIENT_ID: str = "your_github_client_id"
    GITHUB_CLIENT_SECRET: str = "your_github_client_secret"
    GITHUB_REDIRECT_URI: str = "http://localhost:3000/auth/callback"
    GITHUB_TOKEN: Optional[str] = None

    # Google OAuth
    GOOGLE_CLIENT_ID: str = "your_google_client_id"
    GOOGLE_CLIENT_SECRET: str = "your_google_client_secret"
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/auth/callback"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def sync_database_url(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
