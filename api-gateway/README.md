# API Gateway (Node.js)

This directory contains the Node.js API Gateway, which acts as a Backend-for-Frontend (BFF). It exposes REST APIs to the React frontend, translates these into gRPC calls, and communicates with the Python gRPC server.

## Table of Contents

1.  [Prerequisites](#1-prerequisites)
2.  [Setup](#2-setup)
    *   [Install Dependencies](#install-dependencies)
3.  [Running the Server](#3-running-the-server)
4.  [Environment Variables](#4-environment-variables)
5.  [Project Structure](#5-project-structure)

---

## 1. Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)

## 2. Setup

### Install Dependencies

Navigate to the `api-gateway/` directory and install the Node.js dependencies:

```bash
npm install
```

## 3. Running the Server

To start the API Gateway, ensure you have installed the dependencies and the Python gRPC server is running (see its `README.md` for instructions).

From the `api-gateway/` directory, run:

```bash
npm start
```

The API Gateway will start on the address specified in its configuration (default: `localhost:3000`).

## 4. Environment Variables

The API Gateway uses the following environment variables, typically managed via a `.env` file in the project root:

*   `PORT`: The port for the API Gateway (default: `3000`)
*   `GRPC_SERVER_ADDRESS`: The address of the Python gRPC server (default: `localhost:50051`)

You can create a `.env` file in the `api-gateway/` directory like this:

```
PORT=3000
GRPC_SERVER_ADDRESS=localhost:50051
```

## 5. Project Structure

```
api-gateway/
├── .env                  # Environment variables
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Records the exact versions of dependencies
├── README.md             # This README file
├── node_modules/         # Installed Node.js modules
└── src/
    ├── app.js            # Main Express application entry point
    ├── controllers/      # Handles incoming REST requests and interacts with gRPC client
    │   └── libraryController.js
    ├── grpc/             # gRPC client setup and protobuf loading
    │   └── grpcClient.js
    ├── middleware/       # Express middleware (e.g., error handling)
    │   └── errorHandler.js
    ├── proto/            # Protobuf definitions (copied from Python project)
    │   └── library.proto
    └── routes/           # Defines REST API routes
        └── libraryRoutes.js
```