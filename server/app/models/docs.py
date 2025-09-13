from typing import Any

# from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import JSON
from sqlmodel import Column, Field, SQLModel, text


class Docs(SQLModel, table=True):
    __tablename__ = 'documents'  # type: ignore
    id: str | None = Field(default=None, primary_key=True)
    file_name: str | None = Field(default=None)
    file_path: str = Field(unique=True)
    created_by: str | None = Field(default=None, foreign_key='users.id')

    # print('from Templates', j)


class Templates(SQLModel, table=True):
    __tablename__ = 'templates'  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    pdf_id: str | None = Field(default=None, foreign_key='documents.id')
    created_by: str | None = Field(default=None, foreign_key='users.id')
    name: str | None = Field(default=None)
    description: str | None = Field(default=None)
    bounding_boxes: list[dict[str, Any]] = Field(
        sa_column=Column(JSON, nullable=False, server_default=text("'[]'")),
    )


class BoundingBox(SQLModel):
    x: float
    y: float
    width: float
    height: float


class CreateTemplate(SQLModel):
    file_id: str
    username: str
    name: str
    description: str
    bounding_boxes: list[dict[str, Any]] = Field(
        sa_column=Column(JSON, nullable=False, server_default=text("'[]'")),
    )
