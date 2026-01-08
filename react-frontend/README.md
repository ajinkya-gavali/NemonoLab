# React Frontend

This directory contains the React.js frontend application for the Library Management System. It provides the user interface for interacting with the API Gateway to manage books, members, and borrowing records.

## Table of Contents

1.  [Prerequisites](#1-prerequisites)
2.  [Setup](#2-setup)
    *   [Install Dependencies](#install-dependencies)
3.  [Running the Application](#3-running-the-application)
4.  [Environment Variables](#4-environment-variables)
5.  [Project Structure](#5-project-structure)

---

## 1. Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)

## 2. Setup

### Install Dependencies

Navigate to the `react-frontend/` directory and install the Node.js dependencies:

```bash
npm install
```

## 3. Running the Application

To start the React development server, ensure you have installed the dependencies and that both the Python gRPC server and Node.js API Gateway are running (see their respective `README.md` files for instructions).

From the `react-frontend/` directory, run:

```bash
npm run dev
```

The application will typically open in your default web browser at `http://localhost:5173/` (or another available port).

## 4. Environment Variables

The React frontend uses the following environment variables, typically configured in a `.env` file in the project root:

*   `VITE_API_BASE_URL`: The base URL of the API Gateway (default: `http://localhost:3000/api`)

You can create a `.env` file in the `react-frontend/` directory like this:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 5. Project Structure

```
react-frontend/
├── .env                  # Environment variables for Vite
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Records the exact versions of dependencies
├── README.md             # This README file
├── index.html            # Main HTML file
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json
├── node_modules/         # Installed Node.js modules
├── public/               # Static assets
│   └── vite.svg
└── src/
    ├── api.js            # API client for interacting with the API Gateway
    ├── App.css           # Global CSS for the application
    ├── App.tsx           # Main application component and routing setup
    ├── main.tsx          # Entry point for the React application
    ├── index.css         # Main CSS file
    ├── assets/           # Static assets (e.g., images)
    │   └── react.svg
    └── components/       # Reusable React components
        ├── BookList.jsx
        ├── BorrowBook.jsx
        ├── CreateBook.jsx
        ├── CreateMember.jsx
        ├── MemberList.jsx
        ├── UpdateBook.jsx
        ├── UpdateMember.jsx
        └── BorrowingList.jsx
```