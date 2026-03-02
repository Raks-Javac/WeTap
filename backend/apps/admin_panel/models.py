from django.db import models


class AdminLoginAttempt(models.Model):
    email = models.EmailField()
    ip_address = models.CharField(max_length=64)
    success = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
