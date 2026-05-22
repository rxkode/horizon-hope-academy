"""
API v1 Router — aggregates all endpoint routers.
All routes are prefixed /api/v1 in main.py.
"""
from fastapi import APIRouter
from app.api.v1.endpoints import health, admissions, contact, payments, documents, sync, newsletter

api_router = APIRouter()

api_router.include_router(health.router,      prefix="",             tags=["System"])
api_router.include_router(admissions.router,  prefix="/admissions",  tags=["Admissions"])
api_router.include_router(contact.router,     prefix="/contact",     tags=["Contact"])
api_router.include_router(payments.router,    prefix="/payments",    tags=["M-Pesa Payments"])
api_router.include_router(documents.router,   prefix="/documents",   tags=["PDF Documents"])
api_router.include_router(sync.router,        prefix="/sync",        tags=["Offline Sync"])
api_router.include_router(newsletter.router,  prefix="/newsletter",  tags=["Newsletter"])
