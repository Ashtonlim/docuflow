from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, File, UploadFile
from sqlmodel import select

from app.core.db import SessionDep
from app.models.docs import Docs

import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="http://127.0.0.1:9000",
    aws_access_key_id="minioadmin",
    aws_secret_access_key="minioadmin"
)

router = APIRouter(prefix='/documents', tags=['documents'])

# async def upload_file(file: UploadFile = File(...)):

@router.post('/')
async def upload_document(session: SessionDep, file: UploadFile = File(...)) -> Docs:
	s3.upload_fileobj(file.file, "pdf-docs", file.filename)
    res = {"file_path": f"http://127.0.0.1:9000/pdf-docs/{file.filename}"}
	print(res)
	
    with open(f"uploads/{file.filename}", "wb") as f:
        while chunk := await file.read(1024 * 1024):  # read 1MB at a time
            f.write(chunk)
		

	session.add(document)
	session.commit()
	session.refresh(document)
	return document
    return {"filename": file.filename}


@router.get('/')
def read_documents(
	session: SessionDep,
	offset: int = 0,
	limit: Annotated[int, Query(le=100)] = 100,
) -> list[Docs]:
	documents = session.exec(select(Docs).offset(offset).limit(limit)).all()
	return documents


@router.get('/{document_id}')
def read_document(document_id: int, session: SessionDep) -> Docs:
	document = session.get(Docs, document_id)
	if not document:
		raise HTTPException(status_code=404, detail='Document not found')
	return document


@router.delete('/{document_id}')
def delete_document(document_id: int, session: SessionDep):
	document = session.get(Docs, document_id)
	if not document:
		raise HTTPException(status_code=404, detail='Document not found')
	session.delete(document)
	session.commit()
	return {'ok': True}
