from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import create_engine, pool
from sqlalchemy.engine import Engine
from sqlmodel import SQLModel

from app.core.db import settings
from app.models import docs, users

# from psycopg import connection

# # imported to give awareness to alembic on models used
# from app.models import docs, users

# # this is the Alembic Config object, which provides
# # access to the values within the .ini file in use.
# config = context.config


# ================
# Alembic Config object
config = context.config

# print('DB_PATH', settings.DATABASE_URL.unicode_string())
# Override the sqlalchemy.url with our settings
config.set_main_option('sqlalchemy.url', settings.DATABASE_URL.unicode_string())

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = SQLModel.metadata
# =======================

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option('sqlalchemy.url')
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle': 'named'},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable: Engine = create_engine(
        settings.DATABASE_URL.unicode_string(),
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
