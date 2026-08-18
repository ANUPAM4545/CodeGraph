import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.schemas.graph import GraphOverviewDTO, GraphDTO

# This is a static test file assuming we mock the DB and GraphService, 
# or testing the schema responses against fixture data.
# For full integration tests, we would use a Neo4j testcontainer.

client = TestClient(app)

def test_graph_overview_auth_required():
    response = client.get("/api/v1/repositories/1/versions/1/graph/overview")
    # Without auth token, should be 401
    assert response.status_code == 401

def test_graph_api_endpoints_exist():
    # Just asserting the routes are registered and return 401 rather than 404
    endpoints = [
        "/api/v1/repositories/1/versions/1/graph",
        "/api/v1/repositories/1/versions/1/graph/overview",
        "/api/v1/repositories/1/versions/1/graph/nodes/search?q=test",
        "/api/v1/repositories/1/versions/1/graph/nodes/123",
        "/api/v1/repositories/1/versions/1/graph/nodes/123/neighbors"
    ]
    
    for ep in endpoints:
        resp = client.get(ep)
        assert resp.status_code == 401, f"Endpoint {ep} not registered properly"
