# Node API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A simple Node.js API built with Express and PostgreSQL, featuring user authentication with JWT and basic CRUD operations for task management. This project demonstrates best practices for API development, security, and database integration.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
- [License](#license)

## Features

- **User Authentication:** JWT-based authentication with hashed passwords.
- **Task Management:** Create, read, update, and delete tasks.
- **Filtering & Pagination:** Retrieve tasks with filtering and pagination.
- **Input Validation & Sanitization:** Ensures incoming data integrity.
- **Database Connection Testing:** The server tests DB connectivity before starting.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- [PostgreSQL](https://www.postgresql.org/) installed and running
- [npm](https://www.npmjs.com/)

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Akash-Bhavsar/node-api.git
   cd node-api
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root and add:
   ```env
   DATABASE_URL=postgres://your_db_user:your_db_password@localhost:5432/your_db_name
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

## Database Setup

Ensure PostgreSQL is running and execute the following:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50)
);
```

## Running the Application

1. **Start the Server:**
   ```bash
   node index.js
   ```

2. **Expected Output:**
   ```
   Database connection successful!
   Server running on port 3000
   ```

## API Endpoints

### User Endpoints

- **POST `/api/users/register`** - Register a new user.
- **POST `/api/users/login`** - Login and receive a JWT token.

### Task Endpoints (Require JWT)

Include `Authorization: Bearer <your_token>` in requests.

- **GET `/api/tasks`** - Retrieve tasks with optional filtering and pagination.
- **GET `/api/tasks/:id`** - Retrieve a single task by ID.
- **POST `/api/tasks`** - Create a new task.
- **PUT `/api/tasks/:id`** - Update an existing task.
- **DELETE `/api/tasks/:id`** - Delete a task.


## Testing the API

1. **Use Postman or cURL**
   - Download the [Postman Collection](Node%20API.postman_collection.json) and import it into Postman.
2. **Set Up Environment Variables** in Postman for `baseUrl` and `token`.
3. **Test User Registration & Login**.
4. **Test Protected Endpoints** by including the JWT token.
5. **Validate Error Handling** by sending invalid or missing data.
