


## Overview

This Node API is built with Express, Prisma, and PostgreSQL. It provides endpoints for user and task management using JWT authentication and role-based access control.

## Features

**User Endpoints:**

- Register a new user.

- Login using JWT-based authentication.

- List all users (authenticated access).

- Update user profiles (users can only update their own profile).

**Task Endpoints:**

- Create, update, and delete tasks.

- Get tasks for authenticated users.

- Admin users can view all tasks while regular users see only their own.

**Database:**

- PostgreSQL database managed with Prisma ORM for type-safe queries.

## Installation

1. Clone the repository:

```bash

git clone https://github.com/Akash-Bhavsar/node-api.git

```

2. Navigate to the project directory:
```bash

cd node-api

```

3. Install dependencies:

  

```bash

npm install

```

4. Configure Environment Variables:

  
Create a `.env` file in the root directory with the following content (adjust values as needed):

```

DATABASE_URL=postgresql://user:password@localhost:5432/database_name

JWT_SECRET=your_jwt_secret

PORT=3000

```

5. Set Up the Database:

Run Prisma migrations to create the database tables:

  

```bash

npx prisma migrate dev --name init

```


Or, for quick development without migration history:

```bash

npx prisma db push

```

6. Start the Server:

  

```bash

npm start

```

The server runs on the port specified in your `.env` file (default: 3000).

## Testing

Integration tests are written using Vitest and Supertest. To run the tests, execute:

```bash

npm  test

```

Tests cover user registration, login, listing users, and task CRUD operations.

## API Endpoints

**User Endpoints:**

-  `POST /api/users/register` -> Register a new user.

-  `POST /api/users/login` -> Login and receive a JWT token.

-  `GET /api/users/users` -> List all users (authentication required).

-  `PUT /api/users/:id` -> Update a user's profile (authentication required; users can only update their own profile).

**Task Endpoints:**

-  `GET /api/tasks/my-tasks` -> Get tasks for the authenticated user.

-  `GET /api/tasks` -> Get all tasks (ADMIN only; non-admin users see only their tasks).

-  `POST /api/tasks` -> Create a new task.

-  `PUT /api/tasks/:id` -> Update an existing task.

-  `DELETE /api/tasks/:id` -> Delete a task.

## License

This project is licensed under the MIT License.
