import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def dispatch_task(task, *args, **kwargs):
    """
    Dispatch Celery tasks asynchronously when workers are enabled.
    Falls back to synchronous execution when USE_ASYNC_TASKS=false.
    """
    try:
        if getattr(settings, "USE_ASYNC_TASKS", False) and hasattr(task, "delay"):
            task.delay(*args, **kwargs)
            return None

        # SharedTask/Task objects expose `.run`; call directly for sync fallback.
        if hasattr(task, "run"):
            return task.run(*args, **kwargs)
        return task(*args, **kwargs)
    except Exception as exc:
        logger.warning("Task dispatch failed: %s", exc)
        return None
