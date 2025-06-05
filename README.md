# Book Review API

A RESTful API for managing books and reviews, built with Node.js, Express, SQLite (via Sequelize), and JWT-based authentication.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Project Setup Instructions](#project-setup-instructions)  
- [How to Run Locally](#how-to-run-locally)  
- [Environment Variables](#environment-variables)  
- [Database Schema Overview](#database-schema-overview)  
- [Example API Requests (Postman)](#example-api-requests-postman)  
  - [User Authentication](#user-authentication)  
  - [Books Endpoints](#books-endpoints)  
  - [Reviews Endpoints](#reviews-endpoints)  
  - [Search Endpoint](#search-endpoint)  
- [Design Decisions & Assumptions](#design-decisions--assumptions)

---

## Features

- **User Authentication**  
  - JWT-based signup and login  
  - Passwords stored as bcrypt hashes  

- **Book Management**  
  - Create new books (authenticated users only)  
  - List books with pagination and optional filters by author and genre  
  - Retrieve book details by ID, including average rating and paginated reviews  

- **Review Management**  
  - Submit a one-time review per user per book (rating + optional comment)  
  - Update or delete a user’s own review  

- **Search**  
  - Case-insensitive, partial match search by book title or author  

- **Modular Structure**  
  - Separate folders for controllers, routes, models, middleware, and utilities  
  - Environment configuration via `.env`  

---

## Tech Stack

- **Node.js** (JavaScript runtime)  
- **Express.js** (web framework)  
- **SQLite** (database engine) via **Sequelize** (ORM)  
- **JSON Web Tokens** (`jsonwebtoken`) for authentication  
- **bcryptjs** for password hashing  
- **dotenv** for environment variable management  
- **nodemon** (development) for automatic server restarts  

---

## Prerequisites

- **Node.js** (v14+ recommended) and **npm** installed  
- **Git** installed (to clone the repository)  

Verify installation:

```
node -v
npm -v
git --version
```

---

## Project Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/ShreyasDankhade/billeasy__book_review_task.git
   cd billeasy__book_review_task
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Environment Variables**  
      
   - Open `.env` in a text editor and set the following values:

```env

# Secret key for signing JWT tokens (generate a strong random string)
JWT_SECRET=add_your_strong_jwt_secret_here

# JWT expiration (e.g., "1h", "7d")
JWT_EXPIRES_IN=1h

# Port on which the server runs
PORT=3000

# SQLite database file name
DB_STORAGE=database.sqlite
```


 **Important:** Add `.env` to `.gitignore` to prevent committing secrets. But i have added for your reviewing process.

4. **Database Initialization**  
   Sequelize is configured to sync models automatically. On first run, it will create a file named `database.sqlite` in the project root, containing the following tables:
   - **Users**  
   - **Books**  
   - **Reviews**  

---

## How to Run Locally

1. **Start the Development Server**  
   ```bash
   npm run dev
   ```  
   - Uses `nodemon` to watch for file changes and restart automatically.  
   - The server will start on `http://localhost:3000` (or the port specified in \`.env\`).

2. **Access the Health Check**  
   Open a browser or send a GET request to:  
   ```
   GET http://localhost:3000/
   ``` 
   Response:
   ```json
   { "message": "Book Review API is running" }
   ```

3. **Stop the Server**  
   - Press `Ctrl + C` in the terminal.

---

## Environment Variables

| Variable        | Description                                                | Example                                 |
| --------------- | ---------------------------------------------------------- | --------------------------------------- |
| `JWT_SECRET`    | Secret key to sign and verify JSON Web Tokens (must be strong and random) | `ynSWDnfSXiAyKyRltJJn4omljOtlsydS2CWXOXuv7cgQiX8D5hd8ZCdUv7k+3yZy` |
| `JWT_EXPIRES_IN`| Token expiration time                                      | `1h`                                    |
| `PORT`          | Port on which Express server runs                          | `3000`                                  |
| `DB_STORAGE`    | SQLite database file path (relative to project root)       | `database.sqlite`                       |

---

## Database Schema Overview

When `sequelize.sync()` runs on startup, it creates three tables:

1. **Users**  
   | Column     | Type      | Constraints                     |
   | ---------- | --------- | ------------------------------- |
   | `id`       | INTEGER   | Primary Key, Auto-increment     |
   | `username` | STRING    | Unique, Not null                |
   | `email`    | STRING    | Unique, Not null, Valid email   |
   | `password` | STRING    | Not null (bcrypt hash)          |
   | `createdAt`| TIMESTAMP | Auto-generated                  |
   | `updatedAt`| TIMESTAMP | Auto-generated                  |

2. **Books**  
   | Column       | Type    | Constraints                           |
   | ------------ | ------- | ------------------------------------- |
   | `id`         | INTEGER | Primary Key, Auto-increment           |
   | `title`      | STRING  | Not null                              |
   | `author`     | STRING  | Not null                              |
   | `genre`      | STRING  | Not null                              |
   | `description`| TEXT    | Nullable                              |
   | `createdBy`  | INTEGER | Not null, Foreign Key → `Users.id`    |
   | `createdAt`  | TIMESTAMP | Auto-generated                        |
   | `updatedAt`  | TIMESTAMP | Auto-generated                        |

3. **Reviews**  
   | Column     | Type    | Constraints                                                  |
   | ---------- | ------- | ------------------------------------------------------------ |
   | `id`       | INTEGER | Primary Key, Auto-increment                                  |
   | `rating`   | INTEGER | Not null, Min 1, Max 5                                       |
   | `comment`  | TEXT    | Nullable                                                     |
   | `userId`   | INTEGER | Not null, Foreign Key → `Users.id`                           |
   | `bookId`   | INTEGER | Not null, Foreign Key → `Books.id`                           |
   | `createdAt`| TIMESTAMP | Auto-generated                                              |
   | `updatedAt`| TIMESTAMP | Auto-generated                                              |
   | **Unique Constraint** on (`userId`, `bookId`) to ensure exactly one review per user per book |

**Associations**:
- \`User\` 1 → * `Book` (via `createdBy`)
- \`User\` 1 → * `Review` (via `userId`)
- \`Book\` 1 → * `Review` (via `bookId`)




![alt text](<DB ER diagram.png>)


---

## Example API Requests (Postman)

Below are example requests you can import or recreate in Postman. Replace `{{BASE_URL}}` with `http://localhost:3000` (or your deployed URL) and `{{TOKEN}}` with the JWT obtained from login.

### 1. User Authentication

#### 1.1 Sign Up

- **Method**: POST  
- **URL**: `{{BASE_URL}}/signup`  
- **Headers**:  
  - `Content-Type: application/json`  
- **Body (raw JSON)**:
  ```json
    {
        "username": "Shreyas",
        "email":"shreyas@gamil.com",
        "password":"pass@123"
    }
  ```

- **Expected Response** (`201 Created`):
  ```json
    {
    "id": 1,
    "username": "Shreyas",
    "email": "shreyas@gamil.com"
    }
  ```

#### 1.2 Login

- **Method**: POST  
- **URL**: `{{BASE_URL}}/login`  
- **Headers**:  
  - `Content-Type: application/json`  
- **Body (raw JSON)**:
  ```json
    {
        "email":"shreyas@gamil.com",
        "password":"pass@123"
    }
  ```

- **Expected Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5MDUzNTcxLCJleHAiOjE3NDkwNTcxNzF9.9Pg6B1UtEPIcev9nhbcVlautt9LRJbfWbCkO_jWlqdU"
    }
  ```

### 2. Books Endpoints

> **Note**: For any request requiring authentication, include the header:  
> `Authorization: Bearer {{TOKEN}}`

#### 2.1 Create a New Book

- **Method**: POST  
- **URL**: `{{BASE_URL}}/books`  
- **Headers**:  
  - `Content-Type: application/json`  
  - `Authorization: Bearer {{TOKEN}}`  
- **Body (raw JSON)**:
  ```json
  {
    "title": "Still Waters Run Deep",
    "author": "Natalie Brooks",
    "genre": "Psychological Thriller",
    "description": "When a therapist’s patient confesses to a murder no one reported, she finds herself caught in a chilling web of deception, memory, and guilt."
  }
  ```
- **Expected Response** (`201 Created`):

```json
  {
    "id": 1,
    "title": "Still Waters Run Deep",
    "author": "Natalie Brooks",
    "genre": "Psychological Thriller",
    "description": "When a therapist’s patient confesses to a murder no one reported, she finds herself caught in a chilling web of deception, memory, and guilt.",
    "createdBy": 1,
    "updatedAt": "2025-06-04T16:19:30.581Z",
    "createdAt": "2025-06-04T16:19:30.581Z"
    }
```

#### 2.2 Get All Books (with Pagination & Filters)

- **Method**: GET  
- **URL**: `{{BASE_URL}}/books`  
- **Query Parameters (optional)**:  
  - `page` (default: 1)  
  - `limit` (default: 10)  
  - `author` (partial match)  
  - `genre` (partial match)  
- **Example**:
```
  GET http://localhost:3000/books?author=Natalie&genre=Psychological Thriller&page=1&limit=5
```
- **Expected Response** (\`200 OK\`):
  ```json
  {  
    "totalItems": 1,
    "results": [
    {
        "id": 1,
        "title": "Still Waters Run Deep",
        "author": "Natalie Brooks",
        "genre": "Psychological Thriller",
        "description": "When a therapist’s patient confesses to a murder no one reported, she finds herself caught in a chilling web of deception, memory, and guilt.",
        "createdBy": 1,
        "updatedAt": "2025-06-04T16:19:30.581Z",
        "createdAt": "2025-06-04T16:19:30.581Z"
        }
    ],
    "totalPages": 1,
    "currentPage": 1
  }
  ```

#### 2.3 Get Book Details by ID (with Average Rating & Reviews)

- **Method**: GET  
- **URL**: `{{BASE_URL}}/books/:id`  
- **Path Parameter**: `:id` = book ID (e.g., `1`)  
- **Query Parameters (for reviews pagination)**:  
  - `page` (default: 1)  
  - `limit` (default: 10)  
- **Example**:
  ```
  GET http://localhost:3000/books/1?page=1&limit=5
  ```
- **Expected Response** (`200 OK`):
  ```json
    {
        "book": {
            "id": 1,
            "title": "Still Waters Run Deep",
            "author": "Natalie Brooks",
            "genre": "Psychological Thriller",
            "description": "When a therapist’s patient confesses to a murder no one reported, she finds herself caught in a chilling web of deception, memory, and guilt.",
            "createdBy": 1,
            "createdAt": "2025-06-04T16:19:30.581Z",
            "updatedAt": "2025-06-04T16:19:30.581Z"
        },
        "averageRating": "0.00",
        "reviews": {
            "totalItems": 0,
            "results": [],
            "totalPages": 0,
            "currentPage": 1
        }
    }
  ```

### 3. Reviews Endpoints

> **Note**: All review endpoints require authentication (`Authorization: Bearer {{TOKEN}}`).

#### 3.1 Submit a Review for a Book

- **Method**: POST  
- **URL**: `{{BASE_URL}}/books/:id/reviews`  
- **Path Parameter**: `:id` = book ID (e.g., `1`)  
- **Headers**:  
  - `Content-Type: application/json`  
  - `Authorization: Bearer {{TOKEN}}`  
- **Body (raw JSON)**:
  ```json
  {
    "rating": 5,
    "comment": "Absolutely loved it!"
  }
  ```
- **Expected Response** (\`201 Created\`):
  ```json
  {
    "id": 1,
    "rating": 5,
    "comment": "Absolutely loved it!",
    "userId": 1,
    "bookId": 1,
    "updatedAt": "2025-06-04T10:05:00.000Z",
    "createdAt": "2025-06-04T10:05:00.000Z"
  }
  ```

#### 3.2 Update Your Own Review

- **Method**: PUT  
- **URL**: `{{BASE_URL}}/reviews/:id`  
- **Path Parameter**: `:id` = review ID (e.g., `1`)  
- **Headers**:  
  - `Content-Type: application/json`  
  - `Authorization: Bearer {{TOKEN}}`  
- **Body (raw JSON)**:
  ```json
  {
    "rating": 4,
    "comment": "Still great, but with minor quibbles."
  }
  ```
- **Expected Response** (\`200 OK\`):
  ```json
  {
    "id": 1,
    "rating": 4,
    "comment": "Still great, but with minor quibbles.",
    "userId": 1,
    "bookId": 1,
    "createdAt": "2025-06-04T10:05:00.000Z",
    "updatedAt": "2025-06-04T10:10:00.000Z"
  }
  ```

#### 3.3 Delete Your Own Review

- **Method**: DELETE  
- **URL**: `{{BASE_URL}}/reviews/:id`  
- **Path Parameter**: `:id` = review ID (e.g., `1`)  
- **Headers**:  
  - `Authorization: Bearer {{TOKEN}}`  
- **Expected Response** (`200 OK`):
  ```json
  {
    "message": "Review deleted successfully"
  }
  ```

### 4. Search Endpoint

#### 4.1 Search Books by Title or Author

- **Method**: GET  
- **URL**: `{{BASE_URL}}/search`  
- **Query Parameters (required)**:  
  - `q` = search term (partial match on title or author)  
  - `page` (optional, default: 1)  
  - `limit` (optional, default: 10)  
- **Example**:
  ```
  GET http://localhost:3000/search?q=deep&?page=1&limit=5
  ```
- **Expected Response** (`200 OK`):
  ```json
    {
        "totalItems": 1,
        "results": [
            {
                "id": 5,
                "title": "Still Waters Run Deep",
                "author": "Natalie Brooks",
                "genre": "Psychological Thriller",
                "description": "When a therapist’s patient confesses to a murder no one reported, she finds herself caught in a chilling web of deception, memory, and guilt.",
                "createdBy": 1,
                "createdAt": "2025-06-04T16:19:30.581Z",
                "updatedAt": "2025-06-04T16:19:30.581Z"
            }
        ],
        "totalPages": 1,
        "currentPage": 1
    }
  ```

---

## Design Decisions & Assumptions

1. **SQLite via Sequelize**  
   - Chosen for simplicity in a demo/project setting.  
   - `sequelize.sync()` automatically creates tables on startup. For production, migrations would be preferable.

2. **Password Hashing**  
   - Used `bcryptjs` to hash passwords before storing them.  
   - Plain-text passwords are never stored.

3. **JWT-Based Authentication**  
   - On login, issue a token signed with `JWT_SECRET` (stored in `.env`).  
   - Protected routes check the `Authorization` header (Bearer token) and verify with the same secret.

4. **One Review per User per Book**  
   - Enforced by a unique composite index on (`userId`, `bookId`) in the `Review` model.  
   - Controller logic also checks for an existing review to return a clear error message.

5. **Pagination Utility**  
   - Defined a helper (`getPagination`, `getPagingData`) for consistency.  
   - Default `page = 1`, `limit = 10` if not provided.

6. **Case-Insensitive Search**  
   - SQLite’s `LIKE` operator is case-insensitive by default, so partial matches on `title` or `author` work as expected.

7. **Error Handling**  
   - Controllers return appropriate HTTP status codes:  
     - `400 Bad Request` for validation errors or duplicates  
     - `401 Unauthorized` when token is missing/invalid  
     - `403 Forbidden` when trying to modify/delete another user’s review  
     - `404 Not Found` when a resource doesn’t exist  
     - `500 Internal Server Error` for unexpected failures  

8. **Environment Configuration**  
   - All sensitive values (e.g., `JWT_SECRET`) and configurable settings (port, database file) are stored in `.env`.  
   - Production deployments should ensure `.env` is not committed and is loaded securely.

9. **Folder Structure**  
   - Code is organized into logical modules:  
     - `/models`: Sequelize models and associations  
     - `/controllers`: Business logic for each endpoint  
     - `/routes`: Endpoint definitions  
     - `/middleware`: Authentication middleware  
     - `/utils`: Shared utilities (pagination)  
     - `/config`: Database configuration  

---

