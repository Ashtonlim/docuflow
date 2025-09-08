## FastAPI

fastapi dev

## Alembic

Create migration: `uv run alembic revision --autogenerate -m 'init tables'`

Upgrade: `alembic upgrade head`
Upgrade (with number): `alembic upgrade +2`

Downgrade (use number only): `alembic downgrade -1`
