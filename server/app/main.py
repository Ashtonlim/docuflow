from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from sqlmodel import SQLModel
from app.api.main import api_router

# from app.core.db import engine

# app = FastAPI()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    print('this is before app')
    yield
    # Clean up the ML models and release the resources
    print('this is after app')


app = FastAPI(lifespan=lifespan)


origins = [
    'http://localhost',
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Create DB tables on startup
# @app.on_event('startup')
# def on_startup():
# 	SQLModel.metadata.create_all(engine)

app.include_router(api_router)
