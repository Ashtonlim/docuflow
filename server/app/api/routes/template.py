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
def get_templates(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Templates]:
    templates = session.exec(select(Templates).offset(offset).limit(limit)).all()
    return list(templates)


@router.get('/basic', response_model=list[TemplateBasic])
def get_templates_without_boxes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    result = (
        session.exec(
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
        .mappings()
        .all()
    )

    return [TemplateBasic(**row) for row in result]
    # return templates


@router.post('/')
def create_template(session: SessionDep, data: CreateTemplate) -> Any:
    # check if pdf exists
    print('creating template', data)
    # get all documents

    # res = session.exec(select(Templates).where(Templates.created_by == 1))
    # print(f'{res=}')
    try:
        template = Templates(
            pdf_id=data.file_id,
            created_by=1,
            name=data.name,
            description=data.name,
            bounding_boxes=[dict(box) for box in data.bounding_boxes],
        )

        print('is template correct?', template)

        session.add(template)
        session.commit()
        session.refresh(template)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f'couldn not create template: {e}')

    return {'res': 'ok'}


@router.get('/{file_id}')
def get_templates_by_id(file_id: str, session: SessionDep):
    res = session.exec(select(Templates).where(Templates.pdf_id == file_id)).one()
    # res = session.get(Templates, file_id)
    print(f'{res=}')

    return res
