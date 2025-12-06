# from typing import Annotated

# from fastapi import Depends
# from sqlmodel import Session, create_engine

# # connection_str = 'sqlite:///database.db'
# # connection_str = "postgresql://user:password@host:port/dbname"
# connection_str = 'postgresql://postgres:qwe@localhost:5432/docuf'


# connect_args = {'check_same_thread': False}
# engine = create_engine(connection_str, connect_args=connect_args)


# # Dependency for FastAPI
# def get_session():
#     with Session(engine) as session:
#         yield session


# SessionDep = Annotated[Session, Depends(get_session)]
