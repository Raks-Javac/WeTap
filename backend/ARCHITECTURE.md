# Backend Clean Architecture

This backend follows a layered architecture per domain app:

- `models.py` (Domain data)
- `repositories.py` (Data access; ORM queries only)
- `use_cases.py` (Business workflows/orchestration)
- `services.py` (Stable facade for API layer backward compatibility)
- `api/v1/views.py` (Transport layer: validation + response mapping only)

## Layer Rules

1. Views must not implement business logic.
2. Use-cases can call repositories, processors, and cross-domain services.
3. Repositories should only read/write persistence models.
4. Services expose stable function signatures used by views.
5. External integrations stay in infrastructure adapters (e.g. `apps/payments/processors.py`).

## Refactored Apps

- `authn`
- `payments`
- `bills`
- `transfers`
- `transactions`
- `chat`
- `admin_panel`

## Why this is cleaner

- Testability: use-cases are unit-test-friendly.
- Maintainability: DB query logic is isolated in repositories.
- Backward compatibility: views and routes did not change.
- Evolution: v2 endpoints can reuse the same use-cases.

## Next Suggested Steps

- Add tests per `use_cases.py` module.
- Add type checking (mypy) and linting (ruff/flake8) in CI.
- Add repository interfaces if multiple storage backends are planned.
