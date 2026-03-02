import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url
from core.constants import ENV_DEV, ENV_UAT, ENV_STAGING, ENV_PROD

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
ENVIRONMENT = os.getenv("ENVIRONMENT", ENV_DEV).lower()
DEBUG = ENVIRONMENT == ENV_DEV
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-dev-secret")
ALLOWED_HOSTS = [h.strip() for h in os.getenv("ALLOWED_HOSTS", "*").split(",") if h.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    "corsheaders",
    "apps.authn",
    "apps.users",
    "apps.kyc",
    "apps.wallets",
    "apps.cards",
    "apps.nfc",
    "apps.payments",
    "apps.bills",
    "apps.transfers",
    "apps.transactions",
    "apps.chat",
    "apps.admin_panel",
    "apps.audit",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "middleware.request_middleware.RequestSecurityMiddleware",
    "middleware.logging_middleware.RequestLoggingMiddleware",
    "middleware.response_middleware.ResponseEnvelopeMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {"context_processors": [
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ]},
    }
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=int(os.getenv("DB_CONN_MAX_AGE", "60")),
            ssl_require=ENVIRONMENT == ENV_PROD,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME", "wetap"),
            "USER": os.getenv("DB_USER", "postgres"),
            "PASSWORD": os.getenv("DB_PASSWORD", "postgres"),
            "HOST": os.getenv("DB_HOST", "localhost"),
            "PORT": os.getenv("DB_PORT", "5432"),
            "CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "60")),
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "users.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "core.pagination.StandardPagination",
    "EXCEPTION_HANDLER": "core.exception_handler.custom_exception_handler",
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_MIN", "30"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "30"))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/1")
CACHE_BACKEND = os.getenv("CACHE_BACKEND", "redis").lower()
if CACHE_BACKEND == "locmem":
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": f"wetap-{ENVIRONMENT}",
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
            "KEY_PREFIX": f"wetap:{ENVIRONMENT}",
        }
    }

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", REDIS_URL)
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", REDIS_URL)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"

USE_MOCK_PROCESSOR = os.getenv("USE_MOCK_PROCESSOR", "true").lower() == "true"
FIELD_ENCRYPTION_KEY = os.getenv("FIELD_ENCRYPTION_KEY", "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")
INTERSWITCH_BASE_URL = os.getenv("INTERSWITCH_BASE_URL", "")
INTERSWITCH_CLIENT_ID = os.getenv("INTERSWITCH_CLIENT_ID", "")
INTERSWITCH_CLIENT_SECRET = os.getenv("INTERSWITCH_CLIENT_SECRET", "")
MAX_JSON_BODY_BYTES = int(os.getenv("MAX_JSON_BODY_BYTES", "1048576"))
RATE_LIMIT_GLOBAL_PER_MIN = int(os.getenv("RATE_LIMIT_GLOBAL_PER_MIN", "120"))
RATE_LIMIT_OTP_PER_10M = int(os.getenv("RATE_LIMIT_OTP_PER_10M", "5"))
RATE_LIMIT_FAIL_OPEN = os.getenv("RATE_LIMIT_FAIL_OPEN", "true").lower() == "true"

ENABLE_DOCS_IN_DEV = os.getenv("ENABLE_DOCS_IN_DEV", "true").lower() == "true"
SWAGGER_ENABLED = (
    ENVIRONMENT == ENV_UAT
    or ENVIRONMENT == ENV_STAGING
    or (ENVIRONMENT == ENV_DEV and ENABLE_DOCS_IN_DEV)
)
if ENVIRONMENT == ENV_PROD:
    SWAGGER_ENABLED = False

API_SERVER_DEV_URL = os.getenv("API_SERVER_DEV_URL", "http://127.0.0.1:8000")
API_SERVER_UAT_URL = os.getenv("API_SERVER_UAT_URL", "https://uat-api.wetap.app")
API_SERVER_STAGING_URL = os.getenv("API_SERVER_STAGING_URL", "https://staging-api.wetap.app")
API_SERVER_PROD_URL = os.getenv("API_SERVER_PROD_URL", "https://api.wetap.app")

SPECTACULAR_SETTINGS = {
    "TITLE": "WeTap API",
    "DESCRIPTION": "WeTap NFC-first payment platform backend",
    "VERSION": "1.0.0",
    "SORT_OPERATIONS": True,
    "SWAGGER_UI_SETTINGS": {
        "docExpansion": "none",
        "defaultModelsExpandDepth": -1,
        "displayOperationId": False,
        "filter": True,
    },
    "SERVERS": [
        {"url": API_SERVER_DEV_URL, "description": "Development"},
        {"url": API_SERVER_UAT_URL, "description": "UAT"},
        {"url": API_SERVER_STAGING_URL, "description": "Staging"},
        {"url": API_SERVER_PROD_URL, "description": "Production"},
    ],
    "TAGS": [
        {"name": "Auth", "description": "Authentication and token lifecycle"},
        {"name": "Users", "description": "User profile, onboarding, KYC, dashboard"},
        {"name": "Cards", "description": "Card provisioning and management"},
        {"name": "Payments", "description": "Wallet funding and NFC payments"},
        {"name": "Bills", "description": "Biller discovery, validation, and payments"},
        {"name": "Transfers", "description": "Bank and WeTap transfers"},
        {"name": "Transactions", "description": "Transaction history and lookup"},
        {"name": "Chat", "description": "AI assistant chat endpoints"},
        {"name": "Admin", "description": "Admin authentication and operations"},
    ],
}

if ENVIRONMENT == ENV_PROD:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"

CORS_ALLOWED_ORIGINS = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",") if o.strip()]
