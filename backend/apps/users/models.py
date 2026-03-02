import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from core.constants import ADMIN_ROLES


class UserManager(BaseUserManager):
    def create_user(self, email, **extra_fields):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("admin_role", "SUPER_ADMIN")
        user = self.create_user(email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    tap_mode = models.CharField(max_length=20, default="two_tap")
    pin_hash = models.CharField(max_length=255, blank=True)
    is_new = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    admin_role = models.CharField(max_length=20, blank=True, choices=[(r, r) for r in ADMIN_ROLES])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class UserSession(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    jti = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
