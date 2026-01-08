# Production-Grade gRPC Service

This project provides a skeleton for a production-grade gRPC service in Python, following clean architecture principles.

## Project Structure

```
├── app/
│   ├── main.py
│   ├── config.py
│   ├── logging.py
│   ├── grpc/
│   │   ├── __init__.py
│   │   └── server.py
│   ├── services/
│   │   └── __init__.py
│   ├── repositories/
│   │   └── __init__.py
│   ├── db/
│   │   └── __init__.py
│   └── proto/
│       ├── __init__.py
│       ├── helloworld.proto
│       ├── helloworld_pb2.py
│       └── helloworld_pb2_grpc.py
├── requirements.txt
└── README.md
```

## Setup

1.  **Create and activate a virtual environment:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3.  **Generate gRPC code:**

    The gRPC code is already generated, but if you modify the `.proto` file, you need to regenerate it:

    ```bash
    python -m grpc_tools.protoc -I app/proto --python_out=app/proto --grpc_python_out=app/proto app/proto/helloworld.proto
    ```

## Running the Server

To start the gRPC server, run the following command:

```bash
python -m app.main
```

The server will start on `localhost:50051` by default. You can change the host and port in the `.env` file.

## Configuration

The application uses a `.env` file for configuration. A sample `.env` file is provided.

-   `GRPC_SERVER_HOST`: The host for the gRPC server.
-   `GRPC_SERVER_PORT`: The port for the gRPC server.
-   `DATABASE_URL`: The database connection string.

## Logging

The application uses Python's built-in `logging` module for structured logging. Logs are printed to standard output.
