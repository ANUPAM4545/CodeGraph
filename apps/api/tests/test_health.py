from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_check():
    # Because databases might be down in test env, we just check that it returns 200 and has the expected keys
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "services" in data
