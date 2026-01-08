# API Gateway for Library Service

This is an Express.js API gateway that acts as a bridge between a RESTful API and a backend gRPC service for a library management system.

## Prerequisites

- Node.js (v14 or higher)
- A running instance of the Python gRPC backend service.

## Setup

1.  **Clone the repository (if applicable) and navigate to the `api-gateway` directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root of the `api-gateway` directory and add the following variables. Adjust the values if your setup is different.

    ```env
    # The port for the API Gateway to listen on
    API_GATEWAY_PORT=3000

    # The address of the backend gRPC server
    GRPC_SERVER_ADDRESS=localhost:50051
    ```

## Running the Gateway

Once the setup is complete and the backend gRPC service is running, you can start the API gateway:

```bash
npm start
```

The gateway will start, and you should see the following message in your console:
`API Gateway listening on port 3000`

## API Endpoints

-   `POST /api/books`: Create a new book.
-   `POST /api/members`: Create a new member.
-   `POST /api/borrow`: Borrow a book.
-   `POST /api/return`: Return a book.
-   `GET /api/members/:id/borrowed-books`: List all books borrowed by a specific member.
