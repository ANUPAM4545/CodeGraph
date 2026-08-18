import pytest
import hmac
import hashlib
from fastapi.testclient import TestClient
from src.main import app
from src.api.v1.webhooks import verify_github_signature, GITHUB_WEBHOOK_SECRET

client = TestClient(app)

def test_verify_github_signature_valid():
    payload = b'{"ref":"refs/heads/main"}'
    mac = hmac.new(GITHUB_WEBHOOK_SECRET.encode(), msg=payload, digestmod=hashlib.sha256)
    signature = f"sha256={mac.hexdigest()}"
    
    assert verify_github_signature(payload, signature) == True

def test_verify_github_signature_invalid():
    payload = b'{"ref":"refs/heads/main"}'
    signature = "sha256=invalidhash12345"
    assert verify_github_signature(payload, signature) == False

def test_verify_github_signature_missing_prefix():
    payload = b'{"ref":"refs/heads/main"}'
    mac = hmac.new(GITHUB_WEBHOOK_SECRET.encode(), msg=payload, digestmod=hashlib.sha256)
    signature = mac.hexdigest() # Missing sha256=
    assert verify_github_signature(payload, signature) == False
