from typing import Annotated, AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.core.config import Settings

settings = Settings()  # type: ignore
print(settings)

engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.DB_ECHO,
    future=True,
)

# Async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db() -> None:
    """Run at startup to ensure DB is reachable (and optionally create tables)."""
    async with engine.begin() as conn:
        # Only for prototyping — in prod rely on Alembic migrations
        await conn.run_sync(SQLModel.metadata.create_all)


# SessionDep = Annotated[Session, Depends(get_session)]


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


# Depends(get_session): tells FastAPI to call get_session() when an endpoint asks for this dependency.
# Annotated[AsyncSession, Depends(...)]: Python’s way of bundling a type (AsyncSession) with metadata (Depends(get_session)).
# SessionDep: now acts like a shortcut type you can use in routes.
SessionDep = Annotated[AsyncSession, Depends(get_session)]
