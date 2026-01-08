from app.repositories.library_repository import LibraryRepository
from app.db.models import BorrowingStatus
from datetime import date, datetime
from app.logging_service import logger
import grpc
import re

class LibraryService:
    def __init__(self, repository: LibraryRepository):
        self.repository = repository

    def create_book(self, title: str, author: str, published_date: str, isbn: str):
        logger.info(f"Creating book with title: {title} and author: {author} and published date: {published_date} and isbn: {isbn}")
        if not all([title, author, published_date, isbn]):
            raise ValueError("All fields are required for creating a book.")
        try:
            published_date_obj = datetime.strptime(published_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Invalid date format for published_date. Use YYYY-MM-DD.")
        book = self.repository.create_book(title, author, published_date_obj, isbn)
        logger.info(f"Book '{title}' created successfully.")
        return book

    def update_book(self, book_id: str, title: str, author: str, published_date: str, isbn: str):
        logger.info(f"Updating book with id: {book_id}")
        if not all([book_id, title, author, published_date, isbn]):
            raise ValueError("All fields are required for updating a book.")
        
        book = self.repository.get_book_by_id(book_id)
        if not book:
            return None
        
        try:
            published_date_obj = datetime.strptime(published_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Invalid date format for published_date. Use YYYY-MM-DD.")

        updated_book = self.repository.update_book(book_id, title, author, published_date_obj, isbn)
        logger.info(f"Book with id '{book_id}' updated successfully.")
        return updated_book

    def delete_book(self, book_id: str) -> bool:
        logger.info(f"Deleting book with id: {book_id}")
        if not book_id:
            raise ValueError("Book ID is required for deleting a book.")
        
        book = self.repository.get_book_by_id(book_id)
        if not book:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Book with id {book_id} not found.")
            
        result = self.repository.delete_book(book_id)
        logger.info(f"Book with id '{book_id}' deleted successfully.")
        return result

    def get_book(self, book_id: str):
        logger.info(f"Getting book with id: {book_id}")
        if not book_id:
            raise ValueError("Book ID is required for getting a book.")
        book = self.repository.get_book_by_id(book_id)
        if not book:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Book with id {book_id} not found.")
        logger.info(f"Book with id '{book_id}' retrieved successfully.")
        return book

    def list_books(self):
        logger.info("Listing all books.")
        books = self.repository.list_books()
        logger.info(f"Found {len(books)} books.")
        return books

    def list_members(self):
        logger.info("Listing all members.")
        members = self.repository.list_all_members()
        logger.info(f"Found {len(members)} members.")
        return members

    def create_member(self, name: str, email: str):
        logger.info(f"Creating member with name: {name}")
        if not all([name, email]):
            raise ValueError("Name and email are required for creating a member.")
        
        # Basic email format validation
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email format.")

        existing_member = self.repository.get_member_by_email(email)
        if existing_member:
            raise grpc.RpcError(grpc.StatusCode.ALREADY_EXISTS, f"Member with email {email} already exists.")
        member = self.repository.create_member(name, email)
        logger.info(f"Member '{name}' created successfully.")
        return member

    def update_member(self, member_id: str, name: str, email: str):
        logger.info(f"Updating member with id: {member_id}")
        if not all([member_id, name, email]):
            raise ValueError("All fields are required for updating a member.")
        member = self.repository.get_member_by_id(member_id)
        if not member:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Member with id {member_id} not found.")
        
        # Basic email format validation
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email format.")
        
        existing_member_with_email = self.repository.get_member_by_email(email)
        if existing_member_with_email and existing_member_with_email.id != member_id:
            raise grpc.RpcError(grpc.StatusCode.ALREADY_EXISTS, f"Another member with email {email} already exists.")
        updated_member = self.repository.update_member(member_id, name, email)
        logger.info(f"Member with id '{member_id}' updated successfully.")
        return updated_member

    def delete_member(self, member_id: str) -> bool:
        logger.info(f"Deleting member with id: {member_id}")
        if not member_id:
            raise ValueError("Member ID is required for deleting a member.")
        member = self.repository.get_member_by_id(member_id)
        if not member:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Member with id {member_id} not found.")
        result = self.repository.delete_member(member_id)
        logger.info(f"Member with id '{member_id}' deleted successfully.")
        return result
    
    def get_member(self, member_id: str):
        logger.info(f"Getting member with id: {member_id}")
        if not member_id:
            raise ValueError("Member ID is required for getting a member.")
        member = self.repository.get_member_by_id(member_id)
        if not member:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Member with id {member_id} not found.")
        logger.info(f"Member with id '{member_id}' retrieved successfully.")
        return member

    def borrow_book(self, book_id: str, member_id: str):
        logger.info(f"Borrowing book with id: {book_id} for member: {member_id}")
        if not all([book_id, member_id]):
            raise ValueError("Book ID and Member ID are required for borrowing a book.")

        book = self.repository.get_book_by_id(book_id)
        if not book:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Book with id {book_id} not found.")

        if not book.is_available:
            raise grpc.RpcError(grpc.StatusCode.FAILED_PRECONDITION, f"Book with id {book_id} is not available.")

        member = self.repository.get_member_by_id(member_id)
        if not member:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Member with id {member_id} not found.")

        borrow_record = self.repository.create_borrow_record(book_id, member_id)
        logger.info(f"Book with id '{book_id}' borrowed by member with id '{member_id}' successfully.")
        return borrow_record

    def return_book(self, borrow_record_id: str):
        logger.info(f"Returning book for borrow record id: {borrow_record_id}")
        if not borrow_record_id:
            raise ValueError("Borrow record ID is required for returning a book.")

        borrow_record = self.repository.get_borrow_record_by_id(borrow_record_id)
        if not borrow_record:
            raise grpc.RpcError(grpc.StatusCode.NOT_FOUND, f"Borrow record with id {borrow_record_id} not found.")
        
        if borrow_record.status == BorrowingStatus.RETURNED:
            raise grpc.RpcError(grpc.StatusCode.FAILED_PRECONDITION, f"Book for borrow record id {borrow_record_id} has already been returned.")

        updated_borrow_record = self.repository.update_borrow_record_status_to_returned(borrow_record_id)
        logger.info(f"Book for borrow record id '{borrow_record_id}' returned successfully.")
        return updated_borrow_record

    def list_borrowings(self):
        logger.info("Listing all borrowing records.")
        borrow_records = self.repository.list_all_borrowings()
        logger.info(f"Found {len(borrow_records)} borrowing records.")
        return borrow_records
