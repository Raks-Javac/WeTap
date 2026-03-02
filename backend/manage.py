#!/usr/bin/env python3
import os
import sys


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    environment = os.getenv("ENVIRONMENT", "dev").lower()
    protected_cmds = {"flush", "migrate", "loaddata"}
    if environment == "prod" and len(sys.argv) > 1 and sys.argv[1] in protected_cmds:
        raise SystemExit(f"Command '{sys.argv[1]}' is blocked in production.")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("Django is required to run this project.") from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
