# PrimeTrade - Full Stack Task Management Application

A modern, full-stack task management application built with Next.js frontend and Express.js backend, featuring real-time dashboard stats and intuitive task editing capabilities.

## 🚀 Features

### Frontend (Next.js 15)
- **Modern UI**: Built with TailwindCSS and Radix UI components
- **Real-time Dashboard**: Live stats showing task counts by status
- **Task Management**: Create, edit, delete, and update task status
- **Modal Editing**: Pop-up task editing with full form validation
- **Authentication**: Secure JWT-based user authentication
- **Responsive Design**: Mobile-friendly interface
- **Recent Activity**: Shows latest task updates

### Backend (Express.js)
- **RESTful API**: Complete CRUD operations for tasks and users
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Persistent data storage with Mongoose
- **Input Validation**: Server-side validation with express-validator
- **Security Features**: Rate limiting, CORS, helmet protection
- **Error Handling**: Centralized error handling middleware

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **npm** or **yarn** package manager
- **Git** for cloning the repository

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Lucifer1727/primetradeBack.git
cd primetradeBack
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create environment variables file:
```bash
# Copy the example file
cp .env.example .env

# Or create manually
touch .env
```

Add the following environment variables to `.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/primetrade
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/primetrade

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS (optional)
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create environment variables file:
```bash
# Create .env.local file
touch .env.local
```

Add the following to `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 🏃‍♂️ Running the Application

### Method 1: Run Both Servers Simultaneously

From the root directory, you can run both servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Method 2: Using Package Scripts (Recommended)

From the root directory:

**Start Backend:**
```bash
npm run start:backend
```

**Start Frontend (in another terminal):**
```bash
npm run start:frontend
```

### Method 3: Production Build

**Backend Production:**
```bash
cd backend
npm start
```

**Frontend Production:**
```bash
cd frontend
npm run build
npm start
```

## 🌐 Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:3000 (or http://localhost:3001 if 3000 is occupied)
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api (basic endpoint listing)

## 🔐 First Time Setup

1. **Access the Application**: Open http://localhost:3000
2. **Create Account**: Click "Sign Up" and create a new user account
3. **Login**: Use your credentials to log in
4. **Start Managing Tasks**: Create your first task and explore the features

## 📱 Application Features Guide

### Dashboard
- View real-time statistics of your tasks
- See task counts by status (Total, Pending, In Progress, Completed)
- Quick access to recent task activity
- Navigate to task management page

### Task Management
- **Create Tasks**: Click "New Task" to add tasks with title, description, priority, due date, etc.
- **Edit Tasks**: Click the edit icon on any task card to open the edit modal
- **Update Status**: Use "Mark Complete" or "Start" buttons for quick status updates
- **Delete Tasks**: Remove tasks you no longer need

### Task Edit Modal
- Full form editing with all task fields
- Status dropdown (Pending, In Progress, Completed, Cancelled)
- Priority levels (Low, Medium, High, Urgent)
- Due date picker
- Category and tags support

## 🏗️ Project Structure

```
primetradeBack/
├── backend/                 # Express.js API server
│   ├── models/             # Database models (User, Task)
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   └── tasks.js        # Task management routes
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── validation.js   # Input validation
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
│
├── frontend/               # Next.js application
│   ├── app/               # Next.js 13+ app directory
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── login/         # Authentication pages
│   │   └── api/           # API routes (if any)
│   ├── components/        # Reusable components
│   │   ├── ui/            # UI components (buttons, cards, etc.)
│   │   └── dashboard/     # Dashboard-specific components
│   ├── lib/               # Utility libraries
│   │   ├── api-client.ts  # API communication
│   │   └── utils.ts       # Helper functions
│   ├── contexts/          # React contexts
│   └── package.json       # Frontend dependencies
│
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev    # Starts server with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev    # Starts Next.js dev server with hot reload
```

### Code Style
- Backend: Standard JavaScript with Express.js patterns
- Frontend: TypeScript with Next.js 13+ app directory structure
- UI: TailwindCSS for styling, Radix UI for components

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 5000 (backend)
npx kill-port 5000
```

**MongoDB Connection Issues:**
- Ensure MongoDB is running locally OR
- Check your MongoDB Atlas connection string
- Verify network access and credentials

**Environment Variables:**
- Ensure all required environment variables are set
- Check file names (.env for backend, .env.local for frontend)
- Restart servers after changing environment variables

**CORS Issues:**
- Verify frontend URL in backend CORS configuration
- Check API URL in frontend environment variables

**Authentication Issues:**
- Clear browser localStorage and cookies
- Verify JWT_SECRET is set in backend
- Check token expiration settings

### Logs and Debugging

**Backend Logs:**
```bash
cd backend
npm run dev    # Watch console for API requests and errors
```

**Frontend Logs:**
- Open browser developer tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for API request/response details

## 📚 Additional Information

### Database Schema
- **Users**: name, email, password (hashed), role, timestamps
- **Tasks**: title, description, status, priority, category, dueDate, tags, user reference, timestamps

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

### Performance Optimizations
- Database indexing for common queries
- Efficient task filtering and pagination
- Optimized React re-renders
- Image optimization with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


**Happy Task Managing! 🎯**
