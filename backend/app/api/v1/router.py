from fastapi import APIRouter
from app.api.v1.endpoints import health, admissions, contact, payments

api_router = APIRouter()
api_router.include_router(health.router,      prefix="",           tags=["System"])
api_router.include_router(admissions.router,  prefix="/admissions", tags=["Admissions"])
api_router.include_router(contact.router,     prefix="/contact",    tags=["Contact"])
api_router.include_router(payments.router,    prefix="/payments",   tags=["M-Pesa Payments"])
