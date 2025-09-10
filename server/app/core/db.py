from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, create_engine

# sqlite_file_name = ''
sqlite_url = "sqlite:///database.db"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


# Dependency for FastAPI
def get_session():
	with Session(engine) as session:
		yield session


SessionDep = Annotated[Session, Depends(get_session)]
