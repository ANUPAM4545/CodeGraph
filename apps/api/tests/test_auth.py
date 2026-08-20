import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.db.session import get_redis_client
import uuid
import secrets
import base64
import hashlib

client = TestClient(app)

def test_github_login_generates_state(mocker):
    mock_redis = mocker.MagicMock()
    mocker.patch("src.api.v1.auth.get_redis_client", return_value=mock_redis)
    
    response = client.get("/api/v1/auth/login/github")
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert "github.com" in data["url"]
    assert "state=" in data["url"]
    assert "code_challenge=" in data["url"]

def test_google_login_generates_state(mocker):
    mock_redis = mocker.MagicMock()
    mocker.patch("src.api.v1.auth.get_redis_client", return_value=mock_redis)
    
    response = client.get("/api/v1/auth/login/google")
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert "accounts.google.com" in data["url"]
    assert "state=" in data["url"]
    assert "code_challenge=" in data["url"]

def test_github_callback_missing_state():
    response = client.post("/api/v1/auth/callback/github", json={"code": "123"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Missing state or code"

def test_google_callback_missing_state():
    response = client.post("/api/v1/auth/callback/google", json={"code": "123"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Missing state or code"

def test_github_callback_invalid_state(mocker):
    mock_redis = mocker.MagicMock()
    mock_redis.get.return_value = None
    mocker.patch("src.api.v1.auth.get_redis_client", return_value=mock_redis)

    response = client.post("/api/v1/auth/callback/github", json={"code": "123", "state": "invalid_state"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired state parameter"

def test_google_callback_invalid_state(mocker):
    mock_redis = mocker.MagicMock()
    mock_redis.get.return_value = None
    mocker.patch("src.api.v1.auth.get_redis_client", return_value=mock_redis)

    response = client.post("/api/v1/auth/callback/google", json={"code": "123", "state": "invalid_state"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired state parameter"

def test_logout_clears_cookie():
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert response.json()["status"] == "logged_out"
