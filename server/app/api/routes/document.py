import uuid
from typing import Annotated

import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, HTTPException, Query, Response, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
from sqlmodel import select

from app.core.db import SessionDep

# need to add users so fastapi is aware of tables
from app.models import Docs, Users

s3 = boto3.client(
    's3',
    endpoint_url='http://127.0.0.1:9000',
    aws_access_key_id='minioadmin',
    aws_secret_access_key='minioadmin',
)

router = APIRouter(prefix='/documents', tags=['documents'])


# async def upload_file(file: UploadFile = File(...)):
#  = File(...)

BUCKET = 'pdf-docs'
USER = 'ash'


@router.post('/')
async def upload_document(session: SessionDep, file: UploadFile) -> Docs:
    file_id = str(uuid.uuid4())
    # name, ext = os.path.splitext(file.filename)
    # object_key = f'{file_id}{ext}'
    object_key = f'{file_id}.pdf'

    try:
        file.file.seek(0)
        s3.upload_fileobj(file.file, BUCKET, object_key)
    except Exception as e:
        print('err', e)
        raise HTTPException(status_code=500, detail=f'S3 failed to get: {e}')

    # TODO: convert this to env var
    url = f'http://127.0.0.1:9090/browser/pdf-docs/{object_key}'
    doc = Docs(id=file_id, created_by=1, file_name=file.filename, file_path=url)

    try:
        session.add(doc)
        await session.commit()
        await session.refresh(doc)
    except Exception as e:
        print('err2', e)
        await session.rollback()

        # rollback step: delete object from S3
        s3.delete_object(Bucket=BUCKET, Key=object_key)
        raise HTTPException(status_code=500, detail=f'DB commit failed: {e}')
    finally:
        print('done')

    return doc


@router.get('/')
async def get_documents(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Docs]:
    documents = await session.execute(select(Docs).offset(offset).limit(limit))
    return list(documents.scalars().all())


@router.get('/{document_id}')
def get_document(document_id: str, session: SessionDep):
    # async def get_file(filename: str):
    document = session.get(Docs, document_id)

    if not document:
        raise HTTPException(status_code=404, detail='Document not found')

    try:
        # obj = s3.get_object(Bucket=BUCKET, Key=f'{document_id}.pdf')
        url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': BUCKET, 'Key': f'{document_id}.pdf'},
            ExpiresIn=3600,  # URL valid for 1 hour
        )
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f'Could not generate URL: {e}')

    return {'id': document_id, 'name': f'{document_id}.pdf', 'url': url}


@router.get('/{file_name}')
def get_document_by_name(file_name: str, session: SessionDep):
    document = session.get(Docs, file_name)
    if not document:
        raise HTTPException(status_code=404, detail='Document not found')

    return document


@router.delete('/{document_id}')
async def delete_document(document_id: str, session: SessionDep):
    document = session.get(Docs, document_id)

    # Delete the object
    try:
        response = s3.delete_object(Bucket=BUCKET, Key=f'{document_id}.pdf')
        print(f"Object '{document_id}' deleted successfully from bucket '{BUCKET}'.")
        await session.delete(document)
        await session.commit()
        await session.refresh(document)
    except Exception as e:
        await session.rollback()
        print(f'Error deleting object: {e}')
        raise HTTPException(status_code=404, detail='Document not found')

    # # also must delete all associated templates
    return {'ok': True}
