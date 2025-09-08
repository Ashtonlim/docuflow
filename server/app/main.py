from fastapi import FastAPI

# from sqlmodel import SQLModel
from app.api.main import api_router

# from app.core.db import engine

app = FastAPI()


# Create DB tables on startup
# @app.on_event('startup')
# def on_startup():
# 	SQLModel.metadata.create_all(engine)

app.include_router(api_router)
