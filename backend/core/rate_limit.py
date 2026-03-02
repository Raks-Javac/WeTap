import time
from django.conf import settings
from django.core.cache import cache


def is_limited(scope: str, key: str, limit: int, period_seconds: int) -> bool:
    epoch_window = int(time.time() // period_seconds)
    redis_key = f"rl:{scope}:{key}:{epoch_window}"
    count = cache.get(redis_key, 0)
    if count >= limit:
        return True
    if count == 0:
        cache.set(redis_key, 1, timeout=period_seconds)
    else:
        cache.incr(redis_key)
    return False


def rate_limit_config() -> dict:
    return {
        "global_per_min": int(settings.RATE_LIMIT_GLOBAL_PER_MIN),
        "otp_per_10m": int(settings.RATE_LIMIT_OTP_PER_10M),
    }
