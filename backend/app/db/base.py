from sqlalchemy.orm import DeclarativeBase
import sqlalchemy as sa


class Base(DeclarativeBase):
    """All ORM models inherit from this base."""
    pass
