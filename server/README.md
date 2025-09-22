## FastAPI

`uv run fastapi dev app/main.py`

## UV Env management

UV allows [managing an environment](https://docs.astral.sh/uv/guides/projects/) with a pyproject.toml, similar to a packages json

To add packages

```
uv add requests
```

To remove

```
uv remove requests
```

To run dependencies

```
uv run fastapi argsAndOptions
```

## Alembic

Create migration: `uv run alembic revision --autogenerate -m 'init tables'`

Upgrade: `alembic upgrade head`
Upgrade (with number): `alembic upgrade +2`

Downgrade (use number only): `alembic downgrade -1`
