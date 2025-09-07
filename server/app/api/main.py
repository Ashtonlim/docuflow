from fastapi import APIRouter
from app.api.routes import heroes

api_router = APIRouter()
api_router.include_router(heroes.router)
