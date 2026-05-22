"""
Async SQLAlchemy engine and session factory.
Connection pool sized for small school (max 10 concurrent).
Supabase pooler requires statement_cache_size=0 for asyncpg compatibility.
"""
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import get_settings

settings = get_settings()

# Supabase Session Pooler requires statement_cache_size=0
# Without this, asyncpg raises "prepared statement already exists" errors
connect_args = {}
if "supabase.com" in settings.database_url or "pooler.supabase" in settings.database_url:
    connect_args = {"statement_cache_size": 0}

engine = create_async_engine(
    settings.database_url,
    pool_size=5,
    max_overflow=10,
    echo=settings.debug,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
