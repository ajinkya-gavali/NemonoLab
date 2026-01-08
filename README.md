# NemonoLabs Library Management System

This repository contains a distributed Library Management System built with a 3-layer architecture: a React frontend, a Node.js API Gateway, and a Python gRPC Core Backend.

## Table of Contents

1.  [Architecture Overview](#1-architecture-overview)
2.  [Prerequisites](#2-prerequisites)
3.  [Getting Started](#3-getting-started)
    *   [Clone the Repository](#clone-the-repository)
    *   [Environment Variables Setup](#environment-variables-setup)
4.  [Running the Services](#4-running-the-services)
    *   [1. Core Backend (Python gRPC Server)](#1-core-backend-python-grpc-server)
    *   [2. API Gateway (Node.js)](#2-api-gateway-nodejs)
    *   [3. Frontend (React)](#3-frontend-react)
5.  [Project Structure](#5-project-structure)
6.  [Troubleshooting](#6-troubleshooting)

---

## 1. Architecture Overview

The system is composed of three main services:

*   **`PythonProject/` (Core Backend - gRPC Server):** The authoritative service for business logic, database interactions, and managing library entities (books, members, borrowings). Exposes gRPC endpoints.
*   **`api-gateway/` (API Gateway - Node.js):** Acts as a Backend-for-Frontend. Exposes REST APIs to the React frontend, translates these into gRPC calls, and communicates with the Python gRPC server.
*   **`react-frontend/` (Frontend - React):** The user interface for the application, interacting with the API Gateway via REST APIs.

## 2. Prerequisites

Ensure you have the following installed on your system:

*   **Git:** For cloning the repository.
*   **Python 3.10+:** With `pip` for the Python gRPC server.
*   **Node.js (LTS version recommended):** With `npm` for the API Gateway and React frontend.

## 3. Getting Started

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone <repository_url> # Replace <repository_url> with the actual URL
cd NemonoLabs/
```

### Environment Variables Setup

Each project (`PythonProject`, `api-gateway`, `react-frontend`) requires its own `.env` file for configuration. Create an empty `.env` file in the root of each project folder (e.g., `NemonoLabs/PythonProject/.env`, `NemonoLabs/api-gateway/.env`, `NemonoLabs/react-frontend/.env`).

**`PythonProject/.env`**:
```
# gRPC Server
GRPC_SERVER_HOST=localhost
GRPC_SERVER_PORT=50051

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_db
DB_USER=user
DB_PASSWORD=password

LOG_LEVEL=INFO
```

**`api-gateway/.env`**:
```
PORT=3000
GRPC_SERVER_ADDRESS=localhost:50051
```

**`react-frontend/.env`**:
```
VITE_API_BASE_URL=http://localhost:3000/api
```
*(Note: Ensure `GRPC_SERVER_ADDRESS` in `api-gateway/.env` matches `GRPC_SERVER_HOST` and `GRPC_SERVER_PORT` from `PythonProject/.env`)*
*(Note: Ensure `VITE_API_BASE_URL` in `react-frontend/.env` matches `PORT` from `api-gateway/.env`)*

## 4. Running the Services

The services must be started in a specific order: **Core Backend** → **API Gateway** → **Frontend**. You will need three separate terminal windows.

### 1. Core Backend (Python gRPC Server)

This is the primary service.

1.  Open a new terminal.
2.  Navigate to the `PythonProject/` directory:
    ```bash
    cd PythonProject/
    ```
3.  Set up and activate the Python virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
4.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Start the gRPC server:
    ```bash
    python main.py
    ```
    Keep this terminal open and running.

### 2. API Gateway (Node.js)

This service connects the frontend to the core backend.

1.  Open a second new terminal.
2.  Navigate to the `api-gateway/` directory:
    ```bash
    cd api-gateway/
    ```
3.  Install Node.js dependencies:
    ```bash
    npm install
    ```
4.  Start the API Gateway:
    ```bash
    npm start
    ```
    Keep this terminal open and running.

### 3. Frontend (React)

This is the user interface.

1.  Open a third new terminal.
2.  Navigate to the `react-frontend/` directory:
    ```bash
    cd react-frontend/
    ```
3.  Install Node.js dependencies:
    ```bash
    npm install
    ```
4.  Start the React development server:
    ```bash
    npm run dev
    ```
    The application should automatically open in your web browser (e.g., `http://localhost:5173/`).

## 5. Project Structure

```
NemonoLabs/
├── PythonProject/    # Python gRPC Core Backend
├── api-gateway/      # Node.js API Gateway (BFF)
├── react-frontend/   # React.js Frontend
└── README.md         # Top-level documentation (this file)
```

For more detailed information on each specific project, refer to their individual `README.md` files located within their respective directories.

## 6. Troubleshooting

*   **"command not found" for `python` or `npm`:** Ensure Python and Node.js are correctly installed and added to your system's PATH. For Python, ensure your virtual environment is activated.
*   **Connection errors (e.g., "gRPC unavailable", "API failed"):** Verify that the previous service in the chain (e.g., Python server for API Gateway, API Gateway for Frontend) is running and that environment variables (especially `GRPC_SERVER_ADDRESS` and `VITE_API_BASE_URL`) are correctly set and match the actual ports.
*   **Database issues:** If you modify SQLAlchemy models in `PythonProject/app/db/models.py`, you might need to manually delete the `PythonProject/app.db` file and restart the Python server to recreate the database schema.
