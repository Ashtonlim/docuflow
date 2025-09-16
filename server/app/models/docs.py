from typing import Any

# from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import JSON
from sqlmodel import Column, Field, Relationship, SQLModel, text

# need to add users so fastapi is aware of tables
# from app.models.users import Users


class Docs(SQLModel, table=True):
    __tablename__ = 'documents'  # type: ignore
    id: str | None = Field(default=None, primary_key=True)
    file_name: str | None = Field(default=None)
    file_path: str = Field(unique=True)
    created_by: int | None = Field(default=None, foreign_key='users.id', ondelete='CASCADE')

    # users: 'Users' = Relationship(back_populates='documents', cascade_delete=True)
    # print('from Templates', j)


class TemplateBasic(SQLModel):
    id: int | None
    pdf_id: str
    created_by: int
    name: str | None
    description: str | None


class BoundingBox(SQLModel):
    id: str
    label_name: str
    pdfX: float
    pdfY: float
    domY: float
    width: float
    height: float
    page_number: int


class CreateTemplate(SQLModel):
    file_id: str
    created_by: int
    name: str
    description: str | None
    bounding_boxes: list[BoundingBox] = []


class Templates(SQLModel, table=True):
    __tablename__ = 'templates'  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    pdf_id: str = Field(foreign_key='documents.id')
    created_by: int = Field(foreign_key='users.id')
    name: str | None = Field(default='random')
    description: str | None = Field(default=None)
    bounding_boxes: list[dict[str, Any]] = Field(
        sa_column=Column(JSON, nullable=False, server_default=text("'[]'")),
    )
