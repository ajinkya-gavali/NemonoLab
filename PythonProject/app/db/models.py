from sqlalchemy import Column, String, Date, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.db.base import Base

import enum

class BorrowingStatus(str, enum.Enum):
    BORROWED = "BORROWED"
    RETURNED = "RETURNED"

class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True, nullable=False)
    author = Column(String, index=True, nullable=False)
    published_date = Column(Date, nullable=False)
    isbn = Column(String, unique=True, index=True, nullable=False)
    is_available = Column(Boolean, default=True)

    borrow_records = relationship("BorrowRecord", back_populates="book")

class Member(Base):
    __tablename__ = "members"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    join_date = Column(Date, default=datetime.utcnow, nullable=False)

    borrow_records = relationship("BorrowRecord", back_populates="member")

class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    book_id = Column(String, ForeignKey("books.id"), nullable=False)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    borrow_date = Column(Date, default=datetime.utcnow, nullable=False)
    return_date = Column(Date, nullable=True) # Explicitly nullable
    status = Column(Enum(BorrowingStatus), default=BorrowingStatus.BORROWED, nullable=False) # New status column

    book = relationship("Book", back_populates="borrow_records")
    member = relationship("Member", back_populates="borrow_records")
