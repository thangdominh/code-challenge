# Problem 5: A CRUD Server

A professional REST API server built with **Express.js**, **TypeScript**, and **PostgreSQL** following best practices and clean architecture principles.

## Features

- ✅ **RESTful API** with Express.js
- ✅ **TypeScript** for type safety
- ✅ **PostgreSQL** database with connection pooling
- ✅ **Docker & Docker Compose** for easy deployment
- ✅ **Swagger/OpenAPI** documentation
- ✅ **Architecture** (Controllers → Services → Models)
- ✅ **Unit Tests** with Jest
- ✅ **Full CRUD Operations**
  - Create new users
  - Read users with filtering, sorting, and pagination support
  - Update users (full and partial)
  - Soft delete users (preserves data)
  - Restore soft-deleted users
- ✅ **Input Validation** and error handling
- ✅ **Email uniqueness** validation
- ✅ **Seed Data** for quick testing (15 sample users)
- ✅ **Query Filtering** by role, status, and age
- ✅ **Flexible Sorting** by any field (id, name, email, age, role, created_at, updated_at)
- ✅ **Pagination** for large datasets (page-based with comprehensive metadata)
- ✅ **Soft Delete** pattern for data preservation

## Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js 20              |
| Language         | TypeScript              |
| Framework        | Express.js              |
| Database         | PostgreSQL 16           |
| ORM/Query        | pg (node-postgres)      |
| Documentation    | Swagger/OpenAPI         |
| Testing          | Jest + Supertest        |
| Containerization | Docker + Docker Compose |

## Project Structure

```
src/problem5/
├── src/
│   ├── config/
│   │   ├── database.ts       # PostgreSQL connection pool
│   │   ├── migrate.ts        # Database migrations
│   │   ├── seed.ts           # Sample data seeding
│   │   └── swagger.ts        # Swagger configuration
│   ├── controllers/
│   │   └── user.controller.ts      # Request handlers
│   ├── models/
│   │   └── user.model.ts           # Database queries
│   ├── routes/
│   │   └── user.routes.ts          # API routes + Swagger docs
│   ├── services/
│   │   └── user.service.ts         # Business logic
│   ├── types/
│   │   └── user.types.ts           # TypeScript interfaces
│   ├── app.ts                # Express app configuration
│   └── server.ts             # Server startup
├── tests/
│   └── unit/
│       └── user.service.test.ts    # Unit tests
├── Dockerfile                # Docker image definition
├── docker-compose.yml        # Multi-container orchestration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Jest configuration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Prerequisites

Choose one of the following:

**Option 1: Docker (Recommended)**

- Docker Desktop installed
- No other dependencies needed!

**Option 2: Local Development**

- Node.js (v20 or higher)
- PostgreSQL (v16 or higher)
- npm or yarn or pnpm

## Quick Start with Docker (Recommended)

### 1. Start the application

```bash
# Navigate to project directory
cd src/problem5

# Start both API server and PostgreSQL
docker-compose up -d
```

This will:

- Start PostgreSQL on port `5432`
- Start API server on port `3000`
- Automatically run migrations
- Seed the database with 15 sample users

### 2. Access the application

- **API Server**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs

### 3. View logs

```bash
docker-compose logs -f api
```

### 4. Stop the application

```bash
docker-compose down
```

### 5. Stop and remove all data

```bash
docker-compose down -v
```

## Local Development Setup

### 1. Install dependencies

```bash
cd src/problem5
npm install
```

### 2. Configure environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
```

**.env file:**

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=crud_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Set up PostgreSQL

```bash
# Create database (using psql)
createdb crud_db

# Or via SQL
psql -U postgres
CREATE DATABASE crud_db;
\q
```

### 4. Run migrations and seed

```bash
# Run migrations to create tables
npm run migrate

# Seed with sample data (optional)
npm run seed
```

### 5. Start development server

```bash
npm run dev
```

The server will start on http://localhost:3000

## Available Scripts

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Start development server with auto-reload |
| `npm run build`       | Compile TypeScript to JavaScript          |
| `npm start`           | Run production server                     |
| `npm test`            | Run unit tests with coverage              |
| `npm run test:watch`  | Run tests in watch mode                   |
| `npm run migrate`     | Run database migrations                   |
| `npm run seed`        | Seed database with sample data            |
| `npm run docker:up`   | Start Docker containers                   |
| `npm run docker:down` | Stop Docker containers                    |
| `npm run docker:logs` | View Docker logs                          |

## API Documentation

### Swagger UI

Interactive API documentation available at: **http://localhost:3000/api-docs**

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Get All Users

```http
GET /users
```

**Query Parameters:**

_Filtering:_
- `role` - Filter by role (e.g., Developer, Designer, Manager)
- `status` - Filter by status (active/inactive)
- `minAge` - Minimum age filter
- `maxAge` - Maximum age filter
- `includeDeleted` - Include soft-deleted users (true/false, default: false)

_Sorting:_
- `sortBy` - Sort by field (id, name, email, age, role, created_at, updated_at)
- `sortOrder` - Sort order (ASC/DESC, default: DESC)

_Pagination:_
- `page` - Page number (minimum: 1)
- `limit` - Items per page (minimum: 1, maximum: 100)

**Notes:**
- Pagination requires both `page` and `limit` parameters
- Without pagination, all matching users are returned
- With pagination, response includes metadata (totalCount, totalPages, hasNextPage, etc.)

**Examples:**

```bash
# Get all users (no pagination)
curl http://localhost:3000/users

# Get first page with 5 users per page
curl 'http://localhost:3000/users?page=1&limit=5'

# Get second page with 10 users per page
curl 'http://localhost:3000/users?page=2&limit=10'

# Combine pagination with filters
curl 'http://localhost:3000/users?role=Developer&page=1&limit=5'

# Pagination with sorting
curl 'http://localhost:3000/users?sortBy=name&sortOrder=ASC&page=1&limit=10'

# Filter by role and status
curl http://localhost:3000/users?role=Developer&status=active

# Sort by name ascending
curl http://localhost:3000/users?sortBy=name&sortOrder=ASC

# Include soft-deleted users
curl 'http://localhost:3000/users?includeDeleted=true'
```

**Response (without pagination):**
```json
{
  "success": true,
  "count": 4,
  "filters": { "role": "Developer", "status": "active" },
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 28,
      "role": "Developer",
      "status": "active",
      "deleted_at": null,
      "created_at": "2024-11-13T12:00:00.000Z",
      "updated_at": "2024-11-13T12:00:00.000Z"
    }
  ]
}
```

**Response (with pagination):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 28,
      "role": "Developer",
      "status": "active",
      "deleted_at": null,
      "created_at": "2024-11-13T12:00:00.000Z",
      "updated_at": "2024-11-13T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 15,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "filters": { "role": "Developer" }
}
```

#### 2. Get User by ID

```http
GET /users/:id
```

**Example:**

```bash
curl http://localhost:3000/users/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 28,
    "role": "Developer",
    "status": "active",
    "deleted_at": null,
    "created_at": "2024-11-13T12:00:00.000Z",
    "updated_at": "2024-11-13T12:00:00.000Z"
  }
}
```

#### 3. Create User

```http
POST /users
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "age": 32,
  "role": "Designer",
  "status": "active"
}
```

**Required Fields:**

- `name` (string)
- `email` (string, must be unique)
- `role` (string)

**Optional Fields:**

- `age` (number, 0-150)
- `status` (string, default: "active")

**Example:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "age": 32,
    "role": "Designer",
    "status": "active"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 16,
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "age": 32,
    "role": "Designer",
    "status": "active",
    "deleted_at": null,
    "created_at": "2024-11-13T12:30:00.000Z",
    "updated_at": "2024-11-13T12:30:00.000Z"
  }
}
```

#### 4. Update User (Full Update)

```http
PUT /users/:id
Content-Type: application/json
```

**Note:** PUT requires all fields (name, email, role)

**Example:**

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "age": 29,
    "role": "Senior Developer",
    "status": "active"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

#### 5. Update User (Partial Update)

```http
PATCH /users/:id
Content-Type: application/json
```

**Note:** PATCH allows partial updates

**Example:**

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age": 30, "status": "inactive"}'
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

#### 6. Delete User (Soft Delete)

```http
DELETE /users/:id
```

**Note:** This performs a soft delete by setting the `deleted_at` timestamp. The user data is preserved in the database but excluded from regular queries.

**Example:**

```bash
curl -X DELETE http://localhost:3000/users/1
```

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**What happens:**

- User's `deleted_at` field is set to current timestamp
- User is excluded from regular GET requests
- User can be restored using the restore endpoint
- User data is preserved in the database

#### 7. Restore User

```http
POST /users/:id/restore
```

**Note:** Restores a soft-deleted user by setting `deleted_at` to `null`.

**Example:**

```bash
curl -X POST http://localhost:3000/users/1/restore
```

**Response:**

```json
{
  "success": true,
  "message": "User restored successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 28,
    "role": "Developer",
    "status": "active",
    "deleted_at": null,
    "created_at": "2024-11-13T12:00:00.000Z",
    "updated_at": "2024-11-13T12:00:00.000Z"
  }
}
```

#### 8. Get Statistics

```http
GET /stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 15,
    "roles": [
      { "role": "Architect" },
      { "role": "Data Analyst" },
      { "role": "Designer" },
      { "role": "Developer" },
      { "role": "DevOps" },
      { "role": "Manager" },
      { "role": "Product Manager" },
      { "role": "QA Engineer" },
      { "role": "UX Researcher" }
    ],
    "statusBreakdown": [
      { "status": "active", "count": "13" },
      { "status": "inactive", "count": "2" }
    ]
  }
}
```

## Sample Data

The application includes 15 pre-seeded users across different roles:

| Name           | Email                      | Age | Role            | Status   |
| -------------- | -------------------------- | --- | --------------- | -------- |
| John Doe       | john.doe@example.com       | 28  | Developer       | active   |
| Jane Smith     | jane.smith@example.com     | 32  | Designer        | active   |
| Bob Johnson    | bob.johnson@example.com    | 45  | Manager         | active   |
| Alice Williams | alice.williams@example.com | 29  | Developer       | active   |
| Charlie Brown  | charlie.brown@example.com  | 35  | DevOps          | active   |
| Diana Prince   | diana.prince@example.com   | 27  | Designer        | active   |
| Edward Norton  | edward.norton@example.com  | 41  | Architect       | active   |
| Fiona Green    | fiona.green@example.com    | 30  | QA Engineer     | active   |
| George Miller  | george.miller@example.com  | 38  | Product Manager | inactive |
| Hannah Lee     | hannah.lee@example.com     | 26  | Developer       | active   |
| Ian Thompson   | ian.thompson@example.com   | 33  | Developer       | active   |
| Julia Roberts  | julia.roberts@example.com  | 29  | UX Researcher   | active   |
| Kevin Hart     | kevin.hart@example.com     | 40  | Manager         | active   |
| Laura Palmer   | laura.palmer@example.com   | 31  | Data Analyst    | active   |
| Michael Scott  | michael.scott@example.com  | 42  | Manager         | inactive |

## Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

After running tests, coverage report is available in `coverage/` directory.

**Current Coverage:**

- Services: 100%
- Models: Mocked in tests
- Controllers: Integration tests recommended

### Example Test Output

```
 PASS  tests/unit/user.service.test.ts
  UserService
    getAllUsers
      ✓ should return all users (5ms)
      ✓ should return filtered users (2ms)
    getUserById
      ✓ should return a user by id (2ms)
      ✓ should return null when user not found (1ms)
    createUser
      ✓ should create a user successfully (3ms)
      ✓ should throw error when name is empty (2ms)
      ✓ should throw error when email is empty (1ms)
      ✓ should throw error when email format is invalid (1ms)
      ✓ should throw error when email already exists (2ms)
      ✓ should throw error when age is invalid (1ms)
      ✓ should throw error when role is empty (1ms)
    updateUser
      ✓ should update a user successfully (2ms)
      ✓ should return null when user not found (1ms)
      ✓ should check email uniqueness when updating email (2ms)
    deleteUser
      ✓ should delete a user successfully (1ms)
      ✓ should return false when user not found (1ms)
    getStats
      ✓ should return statistics (1ms)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Coverage:    100%
```

## Database Schema

**Table: `users`**

| Column     | Type         | Constraints                |
| ---------- | ------------ | -------------------------- |
| id         | SERIAL       | PRIMARY KEY                |
| name       | VARCHAR(255) | NOT NULL                   |
| email      | VARCHAR(255) | UNIQUE, NOT NULL           |
| age        | INTEGER      |                            |
| role       | VARCHAR(100) | NOT NULL                   |
| status     | VARCHAR(50)  | NOT NULL, DEFAULT 'active' |
| deleted_at | TIMESTAMP    | NULL (for soft delete)     |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP  |
| updated_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP  |

**Indexes:**

- `idx_users_role` on `role`
- `idx_users_status` on `status`
- `idx_users_email` on `email`
- `idx_users_deleted_at` on `deleted_at` (for soft delete queries)

## Architecture Layers

### 1. Controllers (`src/controllers/`)

- Handle HTTP requests and responses
- Validate request parameters
- Call appropriate service methods
- Return formatted responses

### 2. Services (`src/services/`)

- Contain business logic
- Validate business rules (email uniqueness, data validation)
- Call model methods
- Transform data as needed

### 3. Models (`src/models/`)

- Database operations (CRUD)
- SQL queries with parameterization
- Data mapping

### 4. Routes (`src/routes/`)

- Define API endpoints
- Map routes to controllers
- Include Swagger documentation

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (email already exists)
- `500` - Internal Server Error

## Environment Variables

| Variable      | Description       | Default     |
| ------------- | ----------------- | ----------- |
| `PORT`        | Server port       | 3000        |
| `NODE_ENV`    | Environment       | development |
| `DB_HOST`     | PostgreSQL host   | localhost   |
| `DB_PORT`     | PostgreSQL port   | 5432        |
| `DB_NAME`     | Database name     | crud_db     |
| `DB_USER`     | Database user     | postgres    |
| `DB_PASSWORD` | Database password | postgres    |

## Docker Configuration

### Dockerfile

- Multi-stage build for optimized image size
- Node.js 20 Alpine base image
- Non-root user for security
- Production dependencies only in final image

### docker-compose.yml

Includes two services:

1. **postgres** - PostgreSQL 16 database
2. **api** - Express.js application

Features:

- Health checks for PostgreSQL
- Automatic dependency management (API waits for DB)
- Volume persistence for database data
- Easy environment configuration

## Troubleshooting

### Docker Issues

**Problem:** Port 3000 or 5432 already in use

```bash
# Find process using port
lsof -i :3000
lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

**Problem:** Database connection refused

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Local Development Issues

**Problem:** Cannot connect to PostgreSQL

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure database exists: `psql -l`

**Problem:** Migrations fail

- Ensure database exists
- Check database user has necessary permissions
- Run migrations manually: `npm run migrate`

**Problem:** Email already exists error

- Each user must have a unique email
- Check existing users: `curl http://localhost:3000/users`

## Production Deployment

### Build for Production

```bash
# Build TypeScript
npm run build

# Run production server
npm start
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong database credentials
3. Configure connection pooling
4. Set up process manager (PM2, systemd)
5. Use reverse proxy (NGINX)
6. Enable SSL/TLS
7. Set up monitoring and logging

## Example Usage Flow

```bash
# 1. Start the server
docker-compose up -d

# 2. Create a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "email": "sarah.connor@example.com",
    "age": 35,
    "role": "Manager",
    "status": "active"
  }'

# 3. Get all users
curl http://localhost:3000/users

# 4. Filter users by role
curl http://localhost:3000/users?role=Developer

# 5. Get a specific user
curl http://localhost:3000/users/1

# 6. Update a user
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age": 29, "role": "Senior Developer"}'

# 7. Sort users by name ascending
curl 'http://localhost:3000/users?sortBy=name&sortOrder=ASC'

# 8. Filter by role and sort by age
curl 'http://localhost:3000/users?role=Developer&sortBy=age&sortOrder=ASC'

# 9. Get statistics
curl http://localhost:3000/stats

# 10. Soft delete a user
curl -X DELETE http://localhost:3000/users/1

# 11. Verify user is excluded from regular list
curl http://localhost:3000/users

# 12. View deleted users
curl 'http://localhost:3000/users?includeDeleted=true'

# 13. Restore the deleted user
curl -X POST http://localhost:3000/users/1/restore

# 14. Verify user is back in the list
curl http://localhost:3000/users
```

## Future Improvements

Potential enhancements for production use:

- [ ] Add authentication/authorization (JWT)
- [ ] Add password hashing for user passwords
- [ ] Implement rate limiting
- [ ] Add request validation middleware (Joi/Zod)
- [ ] Include integration tests
- [ ] Add database migrations versioning (TypeORM, Prisma)
- [ ] Implement caching layer (Redis)
- [ ] Include audit logging
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring (Prometheus, Grafana)
- [ ] Add full-text search functionality
- [ ] Add user profile pictures
- [ ] Implement hard delete endpoint for admins
- [ ] Add cursor-based pagination for better performance on large datasets

## Support

For issues or questions, please check:

- Swagger docs at `/api-docs`
- Docker logs: `docker-compose logs`
- Application logs in console
