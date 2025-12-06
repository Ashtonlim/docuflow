from typing import Annotated, Any

import boto3
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.core.db import SessionDep

# from app.models import Users
from app.models.docs import CreateTemplate, TemplateBasic, Templates

s3 = boto3.client(
    's3',
    endpoint_url='http://127.0.0.1:9000',
    aws_access_key_id='minioadmin',
    aws_secret_access_key='minioadmin',
)

router = APIRouter(prefix='/templates', tags=['templates'])


# async def upload_file(file: UploadFile = File(...)):
#  = File(...)

BUCKET = 'pdf-docs'
USER = 'ash'

# class Templates(SQLModel, table=True):
#     __tablename__ = 'templates'  # type: ignore

#     id: int | None = Field(default=None, primary_key=True)
#     pdf_id: str | None = Field(default=None, foreign_key='documents.id')
#     created_by: str | None = Field(default=None, foreign_key='users.id')
#     name: str | None = Field(default=None)
#     description: str | None = Field(default=None)
#     bounding_boxes: list[dict[str, Any]] = Field(
#         sa_column=Column(JSON, nullable=False, server_default=text("'[]'")),
#     )


@router.get('/')
async def get_templates(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Templates]:
    templates = await session.execute(select(Templates).offset(offset).limit(limit))
    return list(templates.scalars().all())


@router.get('/basic', response_model=list[TemplateBasic])
async def get_templates_without_boxes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    result = await session.execute(
        select(
            Templates.id,
            Templates.pdf_id,
            Templates.created_by,
            Templates.name,
            Templates.description,
        )  # type: ignore
        .offset(offset)
        .limit(limit)
    )

    return [TemplateBasic(**row) for row in result.mappings().all()]
    # return templates


@router.post('/')
async def create_template(session: SessionDep, data: CreateTemplate) -> Any:
    # check if pdf exists
    # get all documents

    try:
        template = Templates(
            pdf_id=data.file_id,
            created_by=1,
            name=data.name,
            description=data.name,
            bounding_boxes=[dict(box) for box in data.bounding_boxes],
        )

        session.add(template)
        await session.commit()
        await session.refresh(template)
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f'couldn not create template: {e}')

    return {'res': 'ok'}


@router.get('/{file_id}')
async def get_templates_by_id(file_id: int, session: SessionDep):
    res = await session.execute(select(Templates).where(Templates.id == file_id))
    # res = session.get(Templates, file_id)

    return res.scalar_one()
