# Library gRPC Server (PythonProject)

This directory contains the Python gRPC server for the Library Management System. It handles business logic, interacts with the database, and exposes gRPC services for managing books, members, and borrowing records.

## Table of Contents

1.  [Prerequisites](#1-prerequisites)
2.  [Setup](#2-setup)
    *   [Virtual Environment](#virtual-environment)
    *   [Install Dependencies](#install-dependencies)
    *   [Database Setup](#database-setup)
    *   [Generate gRPC Files](#generate-grpc-files)
3.  [Running the Server](#3-running-the-server)
4.  [Environment Variables](#4-environment-variables)
5.  [Project Structure](#5-project-structure)

---

## 1. Prerequisites

Before you begin, ensure you have the following installed:

*   Python 3.8+
*   `pip` (Python package installer)

## 2. Setup

### Virtual Environment

It is highly recommended to use a Python virtual environment to manage dependencies.

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

With your virtual environment activated, install the required Python packages:

```bash
pip install -r requirements.txt
```

### Database Setup

The server uses an SQLite database. The database file (`app.db`) will be created automatically in the `PythonProject/` directory on the first run of `main.py`.

**Note:** If you make changes to the SQLAlchemy models (`app/db/models.py`), you might need to manually delete the `app.db` file to recreate the schema from scratch during development.

### Generate gRPC Files

If you modify `app/proto/library.proto` (or `helloworld.proto`), you will need to regenerate the Python gRPC stub files.

With your virtual environment activated, run the following command from the `PythonProject/` directory:

```bash
python -m grpc_tools.protoc --proto_path=app/proto --python_out=app/proto --grpc_python_out=app/proto app/proto/library.proto
python -m grpc_tools.protoc --proto_path=app/proto --python_out=app/proto --grpc_python_out=app/proto app/proto/helloworld.proto
```

## 3. Running the Server

To start the gRPC server, ensure your virtual environment is activated and run:

```bash
python main.py
```

The server will start on the address specified in its configuration (default: `localhost:50051`).

## 4. Environment Variables

The server uses the following environment variables for configuration. You can set these in a `.env` file in the `PythonProject/` directory.

*   `GRPC_SERVER_HOST`: The host for the gRPC server (default: `localhost`)
*   `GRPC_SERVER_PORT`: The port for the gRPC server (default: `50051`)
*   `DATABASE_URL`: The SQLite database URL (default: `sqlite:///./app.db`)

Example `.env` file:

```
GRPC_SERVER_HOST=localhost
GRPC_SERVER_PORT=50051
DATABASE_URL=sqlite:///./app.db
```

## 5. Project Structure

```
PythonProject/
├── .env                  # Environment variables for configuration
├── requirements.txt      # Python dependencies
├── main.py               # Main entry point to start the gRPC server
├── venv/                 # Python virtual environment (created by setup script)
└── app/
    ├── __init__.py
    ├── config.py         # Configuration settings for the application
    ├── logging_service.py # Centralized logging setup
    ├── db/               # Database related files (models, session, base)
    │   ├── __init__.py
    │   ├── base.py       # SQLAlchemy declarative base for models
    │   ├── database.py   # Manages database engine, session, and table creation
    │   └── models.py     # SQLAlchemy ORM models (Book, Member, BorrowRecord)
    ├── grpc/             # gRPC server implementation and servicer logic
    │   ├── __init__.py
    │   └── server.py     # Implements gRPC service methods
    ├── proto/            # Protobuf definitions and generated Python stubs
    │   ├── __init__.py
    │   ├── helloworld_pb2_grpc.py # Generated gRPC stub
    │   ├── helloworld_pb2.py      # Generated Protobuf messages
    │   ├── helloworld.proto       # Original Protobuf definition
    │   ├── library_pb2_grpc.py    # Generated gRPC stub
    │   ├── library_pb2.py         # Generated Protobuf messages
    │   └── library.proto          # Original Protobuf definition
    ├── repositories/     # Data access layer for interacting with the database
    │   ├── __init__.py
    │   └── library_repository.py  # Repository for CRUD operations
    └── services/         # Business logic layer
        ├── __init__.py
        └── library_service.py     # Implements application's business rules
```