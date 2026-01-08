from app.grpc.server import create_server
from app.config import GRPC_SERVER_HOST, GRPC_SERVER_PORT
from app.logging_service import setup_logging, logger
from app.db.database import create_tables
import time

def main():
    """
    Main function to start the gRPC server.
    """
    setup_logging()
    logger.info("Setting up application")
    
    # Create database tables
    create_tables()

    server = create_server()
    address = f"{GRPC_SERVER_HOST}:{GRPC_SERVER_PORT}"
    server.add_insecure_port(address)

    logger.info(f"Starting gRPC server on {address}")
    server.start()

    try:
        while True:
            time.sleep(86400)  # One day in seconds
    except KeyboardInterrupt:
        logger.info("Stopping gRPC server...")
        server.stop(0)
        logger.info("Server stopped.")
    logger.info("Application shutdown")

if __name__ == "__main__":
    main()
