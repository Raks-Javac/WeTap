from rest_framework.permissions import BasePermission
from core.constants import ADMIN_ROLES


class IsAdminRole(BasePermission):
    allowed_roles = set(ADMIN_ROLES)

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_admin", False) and user.admin_role in self.allowed_roles)
