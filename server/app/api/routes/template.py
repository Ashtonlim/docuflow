import boto3
from fastapi import APIRouter
from sqlmodel import select

from app.core.db import SessionDep
from app.models.docs import CreateTemplate, Templates

# from app.models.users import Users

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


@router.post('/')
def create_template(session: SessionDep, data: CreateTemplate) -> Templates:
    # check if pdf exists
    print('creating templated', data)
    # get all documents

    res = session.exec(select(Templates).where(Templates.created_by == USER))
    print(f'{res=}')

    template = Templates(
        created_by=USER, name=data.name, description=data.name, bounding_boxes=data.bounding_boxes
    )

    session.add(template)
    session.commit()
    session.refresh(template)

    return template


#  -> list[Templates]
@router.get('/{file_id}')
def get_templates(file_id: str, session: SessionDep):
    res = session.exec(select(Templates).where(Templates.pdf_id == file_id))
    print(f'{res=}')

    return res
