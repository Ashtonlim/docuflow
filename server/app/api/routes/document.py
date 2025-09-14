import os
import uuid
from typing import Annotated

import boto3
from fastapi import APIRouter, HTTPException, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlmodel import select

from app.core.db import SessionDep

# need to add users so fastapi is aware of tables
from app.models import Docs, Users

# from app.models.users import Users

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
    name, ext = os.path.splitext(file.filename)
    object_key = f'{file_id}{ext}'

    try:
        file.file.seek(0)
        s3.upload_fileobj(file.file, BUCKET, object_key)
    except Exception as e:
        print('err', e)
        raise HTTPException(status_code=500, detail=f'S3 upload failed: {e}')

    url = f'http://127.0.0.1:9090/browser/pdf-docs/{object_key}'
    doc = Docs(id=file_id, created_by=1, file_name=file.filename, file_path=url)

    try:
        session.add(doc)
        session.commit()
        session.refresh(doc)
    except Exception as e:
        print('err2', e)
        session.rollback()

        # rollback step: delete object from S3
        s3.delete_object(Bucket=BUCKET, Key=object_key)
        raise HTTPException(status_code=500, detail=f'DB commit failed: {e}')
    finally:
        print('done')

    return doc


@router.get('/')
def get_documents(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Docs]:
    documents = session.exec(select(Docs).offset(offset).limit(limit)).all()
    return list(documents)


@router.get('/{document_id}')
def get_document(document_id: str, session: SessionDep):
    # async def get_file(filename: str):
    try:
        data = s3.get_object(BUCKET, document_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f'File not found: {e}')

    # We’ll stream the object back
    return StreamingResponse(
        data,
        media_type='application/pdf',
        headers={'Content-Disposition': f'inline; filename="{document_id}"'},
    )


@router.get('/{file_name}')
def get_document_by_name(file_name: str, session: SessionDep):
    document = session.get(Docs, file_name)
    if not document:
        raise HTTPException(status_code=404, detail='Document not found')
    return document


@router.delete('/{document_id}')
def delete_document(document_id: str, session: SessionDep):
    document = session.get(Docs, document_id)

    # Delete the object
    try:
        response = s3.delete_object(Bucket=BUCKET, Key=f'{document_id}.pdf')
        print(f"Object '{document_id}' deleted successfully from bucket '{BUCKET}'.")
        print(response)
        session.delete(document)
        session.commit()
        session.refresh(document)
    except Exception as e:
        session.rollback()
        print(f'Error deleting object: {e}')
        raise HTTPException(status_code=404, detail='Document not found')

    # # also must delete all associated templates
    return {'ok': True}
