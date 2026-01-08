from sqlalchemy import not_
from sqlalchemy.orm import Session, joinedload
from app.db.models import Book, Member, BorrowRecord, BorrowingStatus
from typing import List, Optional
from datetime import date, datetime
import logging

logger = logging.getLogger(__name__)


class LibraryRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_book(self, title: str, author: str, published_date: date, isbn: str) -> Book:
        logger.info(f"Creating book with title: {title}")
        book = Book(title=title, author=author, published_date=published_date, isbn=isbn)
        self.db_session.add(book)
        self.db_session.commit()
        self.db_session.refresh(book)
        logger.info(f"Book with title '{title}' created successfully with id {book.id}")
        return book

    def get_book_by_id(self, book_id: str) -> Optional[Book]:
        logger.info(f"Getting book by id: {book_id}")
        book = self.db_session.query(Book).filter(Book.id == book_id).first()
        if book:
            logger.info(f"Book with id '{book_id}' found.")
        else:
            logger.info(f"Book with id '{book_id}' not found.")
        return book

    def update_book(self, book_id: str, title: str, author: str, published_date: date, isbn: str) -> Optional[Book]:
        logger.info(f"Updating book with id: {book_id}")
        book = self.get_book_by_id(book_id)
        if book:
            book.title = title
            book.author = author
            book.published_date = published_date
            book.isbn = isbn
            self.db_session.commit()
            self.db_session.refresh(book)
            logger.info(f"Book with id '{book_id}' updated successfully.")
        else:
            logger.info(f"Book with id '{book_id}' not found for update.")
        return book

    def delete_book(self, book_id: str) -> bool:
        logger.info(f"Deleting book with id: {book_id}")
        book = self.get_book_by_id(book_id)
        if book:
            self.db_session.delete(book)
            self.db_session.commit()
            logger.info(f"Book with id '{book_id}' deleted successfully.")
            return True
        logger.info(f"Book with id '{book_id}' not found for deletion.")
        return False

    def list_books(self) -> List[Book]:
        logger.info("Listing all books")
        books = self.db_session.query(Book).all()
        logger.info(f"Found {len(books)} books.")
        return books

    def list_available_books(self) -> List[Book]:
        logger.info("Listing all books currently available for borrowing.")
        
        # Subquery to find book_ids that are currently borrowed
        subquery = self.db_session.query(BorrowRecord.book_id).filter(
            BorrowRecord.status == BorrowingStatus.BORROWED
        ).distinct().subquery()

        # Query for books where their id is NOT in the list of currently borrowed books
        available_books = self.db_session.query(Book).filter(
            not_(Book.id.in_(subquery))
        ).all()
        
        logger.info(f"Found {len(available_books)} books available for borrowing.")
        return available_books

    def list_all_members(self) -> List[Member]:
        logger.info("Listing all members")
        members = self.db_session.query(Member).all()
        logger.info(f"Found {len(members)} members.")
        return members

    def create_member(self, name: str, email: str) -> Member:
        logger.info(f"Creating member with name: {name}")
        member = Member(name=name, email=email)
        self.db_session.add(member)
        self.db_session.commit()
        self.db_session.refresh(member)
        logger.info(f"Member with name '{name}' created successfully with id {member.id}")
        return member

    def get_member_by_id(self, member_id: str) -> Optional[Member]:
        logger.info(f"Getting member by id: {member_id}")
        member = self.db_session.query(Member).filter(Member.id == member_id).first()
        if member:
            logger.info(f"Member with id '{member_id}' found.")
        else:
            logger.info(f"Member with id '{member_id}' not found.")
        return member

    def update_member(self, member_id: str, name: str, email: str) -> Optional[Member]:
        logger.info(f"Updating member with id: {member_id}")
        member = self.get_member_by_id(member_id)
        if member:
            member.name = name
            member.email = email
            self.db_session.commit()
            self.db_session.refresh(member)
            logger.info(f"Member with id '{member_id}' updated successfully.")
        else:
            logger.info(f"Member with id '{member_id}' not found for update.")
        return member

    def delete_member(self, member_id: str) -> bool:
        logger.info(f"Deleting member with id: {member_id}")
        member = self.get_member_by_id(member_id)
        if member:
            self.db_session.delete(member)
            self.db_session.commit()
            logger.info(f"Member with id '{member_id}' deleted successfully.")
            return True
        logger.info(f"Member with id '{member_id}' not found for deletion.")
        return False

    def get_member_by_email(self, email: str) -> Optional[Member]:
        logger.info(f"Getting member by email: {email}")
        member = self.db_session.query(Member).filter(Member.email == email).first()
        if member:
            logger.info(f"Member with email '{email}' found.")
        else:
            logger.info(f"Member with email '{email}' not found.")
        return member

    def create_borrow_record(self, book_id: str, member_id: str) -> BorrowRecord:
        logger.info(f"Creating borrow record for book id: {book_id} and member id: {member_id}")
        borrow_record = BorrowRecord(book_id=book_id, member_id=member_id, status=BorrowingStatus.BORROWED)
        
        book = self.get_book_by_id(book_id)
        if book:
            book.is_available = False
        
        self.db_session.add(borrow_record)
        self.db_session.commit()
        self.db_session.refresh(borrow_record)
        logger.info(f"Borrow record for book id '{book_id}' and member id '{member_id}' created successfully with id {borrow_record.id}")
        return borrow_record

    def get_borrow_record_by_id(self, borrow_record_id: str) -> Optional[BorrowRecord]:
        logger.info(f"Getting borrow record by id: {borrow_record_id}")
        borrow_record = self.db_session.query(BorrowRecord).filter(BorrowRecord.id == borrow_record_id).first()
        if borrow_record:
            logger.info(f"Borrow record with id '{borrow_record_id}' found.")
        else:
            logger.info(f"Borrow record with id '{borrow_record_id}' not found.")
        return borrow_record

    def update_borrow_record_status_to_returned(self, borrow_record_id: str) -> Optional[BorrowRecord]:
        logger.info(f"Attempting to return borrow record with id: {borrow_record_id}")
        borrow_record = self.get_borrow_record_by_id(borrow_record_id)
        if borrow_record:
            if borrow_record.status == BorrowingStatus.RETURNED:
                logger.info(f"Borrow record with id '{borrow_record_id}' is already returned.")
                return borrow_record # Already returned, no change needed
            
            borrow_record.return_date = datetime.utcnow().date() # Use date() to match Column(Date)
            borrow_record.status = BorrowingStatus.RETURNED
            
            book = self.get_book_by_id(borrow_record.book_id)
            if book:
                book.is_available = True
            
            self.db_session.commit()
            self.db_session.refresh(borrow_record)
            logger.info(f"Borrow record with id '{borrow_record_id}' updated to RETURNED successfully.")
        else:
            logger.info(f"Borrow record with id '{borrow_record_id}' not found for update.")
        return borrow_record
        
    def list_all_borrowings(self) -> List[BorrowRecord]:
        logger.info("Listing all borrowing records with book and member details")
        borrowings = self.db_session.query(BorrowRecord).options(
            joinedload(BorrowRecord.book),
            joinedload(BorrowRecord.member)
        ).all()
        logger.info(f"Found {len(borrowings)} borrowing records.")
        return borrowings
        

