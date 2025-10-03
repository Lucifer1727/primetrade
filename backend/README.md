# PrimeTrade Backend API

A robust Node.js/Express backend API for task management with user authentication, built for the Frontend Developer Intern assignment.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Password hashing with bcrypt
  - Protected routes middleware
  - Token refresh functionality

- **User Management**
  - User profile management
  - Password change functionality
  - Account deactivation
  - User statistics

- **Task Management**
  - Full CRUD operations on tasks
  - Task filtering and search
  - Pagination support
  - Task categories and priorities
  - Due date management
  - Task archiving
  - Bulk operations
  - Task statistics

- **Security**
  - Helmet for security headers
  - Rate limiting
  - Input validation and sanitization
  - CORS configuration
  - Error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Environment**: dotenv

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables as needed

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

## Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| POST | `/logout` | Logout user | Private |
| POST | `/refresh` | Refresh token | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |
| DELETE | `/account` | Deactivate account | Private |
| GET | `/stats` | Get user statistics | Private |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all tasks (with filters) | Private |
| GET | `/:id` | Get single task | Private |
| POST | `/` | Create new task | Private |
| PUT | `/:id` | Update task | Private |
| DELETE | `/:id` | Delete task | Private |
| PATCH | `/:id/archive` | Archive/unarchive task | Private |
| GET | `/stats/overview` | Get task statistics | Private |
| PATCH | `/bulk` | Bulk update tasks | Private |

## API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Create Task
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management app",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "tags": ["project", "urgent"]
}
```

### Get Tasks with Filters
```bash
GET /api/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String (optional),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String (optional),
  status: String (enum: ['pending', 'in-progress', 'completed', 'cancelled']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  category: String (optional),
  dueDate: Date (optional),
  completedAt: Date (optional),
  tags: [String] (optional),
  user: ObjectId (ref: 'User', required),
  isArchived: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

## Security Features

1. **Password Hashing**: Using bcrypt with salt rounds of 12
2. **JWT Authentication**: Secure token-based authentication
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Helmet**: Security headers for protection
5. **Input Validation**: Server-side validation using express-validator
6. **CORS**: Configured for specific origins

## Database Indexes

For optimal performance, the following indexes are created:

**User Collection:**
- email (unique)

**Task Collection:**
- user + status
- user + priority
- user + category
- user + dueDate
- user + createdAt (descending)

## Scaling Considerations

1. **Database Optimization**: Proper indexing and query optimization
2. **Caching**: Redis can be added for session management and caching
3. **Load Balancing**: Multiple server instances with load balancer
4. **Database Scaling**: MongoDB sharding or read replicas
5. **CDN**: For static assets and file uploads
6. **Monitoring**: Application monitoring and logging
7. **Containerization**: Docker for deployment consistency

## Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Development Scripts
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Code Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── .env            # Environment variables
├── server.js       # Main server file
└── package.json    # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.