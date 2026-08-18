import logging
from sqlalchemy.orm import Session
from src.db.models.organization import OrganizationMember

logger = logging.getLogger(__name__)

# RBAC Matrix
# Format: role -> set of permissions
ROLE_PERMISSIONS = {
    "OWNER": {"READ", "ANALYZE", "MANAGE", "DELETE", "MANAGE_MEMBERS", "QUERY_AI", "VIEW_ARCHITECTURE"},
    "ADMIN": {"READ", "ANALYZE", "MANAGE", "MANAGE_MEMBERS", "QUERY_AI", "VIEW_ARCHITECTURE"},
    "MEMBER": {"READ", "ANALYZE", "QUERY_AI", "VIEW_ARCHITECTURE"},
    "VIEWER": {"READ", "VIEW_ARCHITECTURE"}
}

class AuthorizationException(Exception):
    pass

class AuthorizationService:
    def __init__(self, db: Session):
        self.db = db

    def check_permission(self, user_id: str, organization_id: str, action: str) -> bool:
        """
        Verify if a user has a specific permission in an organization.
        """
        member = self.db.query(OrganizationMember).filter(
            OrganizationMember.user_id == user_id,
            OrganizationMember.organization_id == organization_id
        ).first()

        if not member:
            logger.warning(f"User {user_id} is not a member of organization {organization_id}")
            return False

        role = member.role
        allowed_actions = ROLE_PERMISSIONS.get(role, set())
        
        if action in allowed_actions:
            return True
            
        logger.warning(f"User {user_id} (Role: {role}) denied action {action} on org {organization_id}")
        return False
        
    def require_permission(self, user_id: str, organization_id: str, action: str):
        """
        Raise AuthorizationException if permission is denied.
        """
        if not self.check_permission(user_id, organization_id, action):
            raise AuthorizationException(f"Missing permission: {action}")
