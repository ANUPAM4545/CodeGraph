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
    assert "state=" in data["url"]
    assert "code_challenge=" in data["url"]

def test_github_callback_missing_state():
    response = client.post("/api/v1/auth/callback/github", json={"code": "123"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Missing state or code"

def test_github_callback_invalid_state(mocker):
    # Mock redis to return None
    mock_redis = mocker.MagicMock()
    mock_redis.get.return_value = None
    mocker.patch("src.api.v1.auth.get_redis_client", return_value=mock_redis)

    response = client.post("/api/v1/auth/callback/github", json={"code": "123", "state": "invalid_state"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired state parameter"

def test_github_callback_deletes_state(mocker):
    mock_redis = mocker.MagicMock()
    mock_redis.get.return_value = b"some_verifier"
    mocker.patch("src.api.v1.auth.get_redis_client", return_value=mock_redis)
    
    # We expect HTTPX to fail because we aren't mocking it here, but we can verify redis delete was called before it fails
    # Mock httpx.AsyncClient
    mocker.patch("httpx.AsyncClient.post", side_effect=Exception("HTTPX called"))
    
    with pytest.raises(Exception):
        client.post("/api/v1/auth/callback/github", json={"code": "123", "state": "valid_state"})
        
    mock_redis.delete.assert_called_once_with("oauth_state:valid_state")
