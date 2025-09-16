from fastapi import APIRouter

from app.api.routes import document, template

api_router = APIRouter()
api_router.include_router(document.router)
api_router.include_router(template.router)
