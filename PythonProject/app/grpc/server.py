from concurrent import futures
import grpc
from app.proto import library_pb2, library_pb2_grpc
from app.logging_service import logger
from app.services.library_service import LibraryService
from app.repositories.library_repository import LibraryRepository
from app.db.database import get_db_session
from google.protobuf import timestamp_pb2
from datetime import datetime

class LibraryServiceServicer(library_pb2_grpc.LibraryServiceServicer):
    def _execute_with_service(self, context, action):
        try:
            logger.info("Executing service action")
            with get_db_session() as db_session:
                repo = LibraryRepository(db_session)
                service = LibraryService(repo)
                result = action(service)
                logger.info("Service action executed successfully")
                return result
        except ValueError as e:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(e))
        except grpc.RpcError as e:
            context.set_code(e.code())
            context.set_details(e.details())
        except Exception as e:
            logger.exception(f"An unexpected error occurred: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details("An unexpected error occurred")
        return None

    def CreateBook(self, request, context):
        def action(service):
            logger.info(f"Creating book with title: {request.title}")
            published_date = request.published_date
            book = service.create_book(request.title, request.author, published_date, request.isbn)
            logger.info(f"Book created with ID: {book.id}")
            return library_pb2.CreateBookResponse(book=self._to_book_proto(book))
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.CreateBookResponse()

    def UpdateBook(self, request, context):
        def action(service):
            logger.info(f"Updating book with ID: {request.id}")
            published_date = request.published_date
            book = service.update_book(request.id, request.title, request.author, published_date, request.isbn)
            if not book:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(f"Book with id {request.id} not found")
                return None
            logger.info(f"Book with ID: {request.id} updated successfully")
            return library_pb2.UpdateBookResponse(book=self._to_book_proto(book))
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.UpdateBookResponse()

    def DeleteBook(self, request, context):
        def action(service):
            logger.info(f"Deleting book with ID: {request.id}")
            success = service.delete_book(request.id)
            if not success:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(f"Book with id {request.id} not found")
                return None
            logger.info(f"Book with ID: {request.id} deleted successfully")
            return library_pb2.google_dot_protobuf_dot_empty__pb2.Empty()
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.google_dot_protobuf_dot_empty__pb2.Empty()

    def GetBook(self, request, context):
        def action(service):
            logger.info(f"Getting book with ID: {request.id}")
            book = service.get_book(request.id)
            logger.info(f"Book with ID: {request.id} retrieved successfully")
            return self._to_book_proto(book)
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.Book()
    
    def ListBooks(self, request, context):
        def action(service):
            logger.info("Listing all books")
            books = service.list_books()
            logger.info(f"Listed {len(books)} books")
            return library_pb2.ListBooksResponse(books=[self._to_book_proto(book) for book in books])
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.ListBooksResponse()

    def ListMembers(self, request, context):
        def action(service):
            logger.info("Listing all members")
            members = service.list_members()
            logger.info(f"Listed {len(members)} members")
            return library_pb2.ListMembersResponse(members=[self._to_member_proto(member) for member in members])
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.ListMembersResponse()

    def CreateMember(self, request, context):
        def action(service):
            logger.info(f"Creating member with name: {request.name}")
            member = service.create_member(request.name, request.email)
            logger.info(f"Member created with ID: {member.id}")
            return library_pb2.CreateMemberResponse(member=self._to_member_proto(member))
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.CreateMemberResponse()

    def UpdateMember(self, request, context):
        def action(service):
            logger.info(f"Updating member with ID: {request.id}")
            member = service.update_member(request.id, request.name, request.email)
            if not member:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(f"Member with id {request.id} not found")
                return None
            logger.info(f"Member with ID: {request.id} updated successfully")
            return library_pb2.UpdateMemberResponse(member=self._to_member_proto(member))
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.UpdateMemberResponse()

    def DeleteMember(self, request, context):
        def action(service):
            logger.info(f"Deleting member with ID: {request.id}")
            success = service.delete_member(request.id)
            if not success:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(f"Member with id {request.id} not found")
                return None
            logger.info(f"Member with ID: {request.id} deleted successfully")
            return library_pb2.google_dot_protobuf_dot_empty__pb2.Empty()
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.google_dot_protobuf_dot_empty__pb2.Empty()

    def GetMember(self, request, context):
        def action(service):
            logger.info(f"Getting member with ID: {request.id}")
            member = service.get_member(request.id)
            logger.info(f"Member with ID: {request.id} retrieved successfully")
            return self._to_member_proto(member)
        
        response = self._execute_with_service(context, action)
        return response or library_pb2.Member()

    def BorrowBook(self, request, context):
        def action(service):
            logger.info(f"Borrowing book with ID: {request.book_id} for member ID: {request.member_id}")
            borrow_record = service.borrow_book(request.book_id, request.member_id)
            logger.info(f"Book with ID: {request.book_id} borrowed successfully by member ID: {request.member_id}")
            return library_pb2.BorrowBookResponse(borrow_record=self._to_borrow_record_proto(borrow_record))

        response = self._execute_with_service(context, action)
        return response or library_pb2.BorrowBookResponse()

    def ReturnBook(self, request, context):
        def action(service):
            logger.info(f"Returning book with borrow record ID: {request.borrow_record_id}")
            borrow_record = service.return_book(request.borrow_record_id)
            logger.info(f"Book with borrow record ID: {request.borrow_record_id} returned successfully")
            return library_pb2.ReturnBookResponse(borrow_record=self._to_borrow_record_proto(borrow_record))

        response = self._execute_with_service(context, action)
        return response or library_pb2.ReturnBookResponse()

    def ListBorrowings(self, request, context):
        def action(service):
            logger.info("Listing all borrowing records")
            borrow_records_with_details = service.list_borrowings()
            borrowing_details_list = []
            for br_with_details in borrow_records_with_details:
                borrowing_details_list.append(library_pb2.BorrowingDetails(
                    borrow_record=self._to_borrow_record_proto(br_with_details),
                    book=self._to_book_proto(br_with_details.book),
                    member=self._to_member_proto(br_with_details.member)
                ))
            logger.info(f"Listed {len(borrowing_details_list)} borrowing records with details")
            return library_pb2.ListBorrowingsResponse(borrowings=borrowing_details_list)

        response = self._execute_with_service(context, action)
        return response or library_pb2.ListBorrowingsResponse()

    def _to_book_proto(self, book):
        return library_pb2.Book(id=book.id, title=book.title, author=book.author, published_date=book.published_date.strftime("%Y-%m-%d"), isbn=book.isbn, is_available=book.is_available)

    def _to_member_proto(self, member):
        return library_pb2.Member(id=member.id, name=member.name, email=member.email, join_date=member.join_date.strftime("%Y-%m-%d"))

    def _to_borrow_record_proto(self, borrow_record):
        proto_return_date = None
        if borrow_record.return_date:
            proto_return_date = timestamp_pb2.Timestamp()
            proto_return_date.FromDatetime(datetime.combine(borrow_record.return_date, datetime.min.time())) # Convert date to datetime for FromDatetime

        return library_pb2.BorrowRecord(
            id=borrow_record.id,
            book_id=borrow_record.book_id,
            member_id=borrow_record.member_id,
            borrow_date=borrow_record.borrow_date.strftime("%Y-%m-%d"),
            return_date=proto_return_date,
            status=library_pb2.BorrowingStatus.Value(borrow_record.status.name) # Convert ORM Enum to Protobuf Enum
        )

def create_server():
    logger.info("Creating gRPC server")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    library_pb2_grpc.add_LibraryServiceServicer_to_server(
        LibraryServiceServicer(), server
    )
    logger.info("gRPC server created successfully")
    return server

