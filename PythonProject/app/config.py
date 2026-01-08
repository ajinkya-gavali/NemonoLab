from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment variables from .env file
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# gRPC server configuration
GRPC_SERVER_HOST = os.getenv("GRPC_SERVER_HOST", "localhost")
GRPC_SERVER_PORT = int(os.getenv("GRPC_SERVER_PORT", 50051))

# Database configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "mydatabase")
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
