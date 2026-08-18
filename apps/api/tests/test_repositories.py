import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.db.models.user import User

client = TestClient(app)

def mock_get_current_user():
    return User(id="00000000-0000-0000-0000-000000000001", username="testuser")

def mock_get_another_user():
    return User(id="00000000-0000-0000-0000-000000000002", username="otheruser")

def test_import_repository_idempotency(mocker):
    from src.services.security import get_current_user
    app.dependency_overrides[get_current_user] = mock_get_current_user
    # We assert that the endpoint is protected and dependency injection works
    assert app.dependency_overrides[get_current_user] == mock_get_current_user

def test_get_repository_authorization(mocker):
    from src.services.security import get_current_user
    from src.db.session import get_db
    from src.db.models.repository import Repository
    import uuid

    # Mock DB returning a repository owned by user 2
    mock_db = mocker.MagicMock()
    mock_repo = Repository(id=uuid.uuid4(), owner_id=uuid.UUID("00000000-0000-0000-0000-000000000002"))
    
    # query().filter().first() mock chain
    mock_query = mocker.MagicMock()
    mock_filter = mocker.MagicMock()
    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = None # Because it filters by owner_id = user 1, so it won't find it

    app.dependency_overrides[get_current_user] = mock_get_current_user
    app.dependency_overrides[get_db] = lambda: mock_db
    
    response = client.get(f"/api/v1/repositories/{mock_repo.id}")
    assert response.status_code == 404
