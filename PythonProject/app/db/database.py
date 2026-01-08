import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from app.config import (
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
)
from app.logging_service import logger
from app.db.base import Base

# Construct the database URL from environment variables
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    # Create the SQLAlchemy engine with connection pooling
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        poolclass=QueuePool,
        pool_size=10,
        max_overflow=20,
        pool_recycle=3600,
    )

    # Create a configured "Session" class
    SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    logger.info("Database engine and session factory created successfully.")

except Exception as e:
    logger.exception(f"Failed to create database engine or session factory: {e}")
    raise

from contextlib import contextmanager

@contextmanager
def get_db_session():
    """
    Provide a transactional scope around a series of operations.
    """
    logger.info("Creating a new database session.")
    session = SessionFactory()
    try:
        yield session
        session.commit()
        logger.info("Database session committed successfully.")
    except Exception as e:
        session.rollback()
        logger.exception(f"Database session rolled back due to an exception: {e}")
        raise
    finally:
        session.close()
        logger.info("Database session closed.")

def create_tables():
    """
    Create all tables in the database.
    """
    logger.info("Creating database tables.")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.exception(f"Failed to create database tables: {e}")
        raise
