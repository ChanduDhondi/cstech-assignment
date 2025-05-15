# MERN Stack Web Application

This is a full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js). The application supports user registration and login, agent management, CSV/XLSX file upload for task distribution, and a protected dashboard.

---

## 🌐 Project Structure

├── backend
│ ├── controllers
│ │ └── appController.js # Handles business logic
│ ├── models
│ │ ├── agent.js # Mongoose schema for agents
│ │ ├── task.js # Mongoose schema for tasks
│ │ └── user.js # Mongoose schema for users
│ ├── routes
│ │ └── appRoute.js # Defines API routes
│ ├── middleware.js # Authentication & error handling middleware
│ └── server.js # Entry point of the backend server
│
├── front-end
│ ├── index.html # Main HTML file
│ ├── vite.config.js # Vite configuration for React
│ ├── README.md # Front-end specific documentation (if needed)
│ └── src
│ ├── addagent.jsx # Component for adding new agents
│ ├── agentView.jsx # Component to view agent details
│ ├── App.jsx # Main React component
│ ├── dashboard.jsx # Protected dashboard view
│ ├── loginform.jsx # Login component
│ ├── logout.jsx # Logout component
│ ├── main.jsx # React entry point
│ ├── registerForm.jsx # Registration form
│ ├── uploadcsv.jsx # CSV upload component
│ └── index.css # Global styles

## ⚙️ Features

- 🔐 **User Authentication** (Login, Register, JWT-based auth)
- 👥 **Agent Management** (Add/View agents)
- 📤 **CSV Upload** for task creation and distribution
- 🧾 **Dashboard** with protected routes
- 🚀 **React Frontend** powered by Vite
- 🌐 **RESTful API** built with Express and MongoDB

---

## 📦 Getting Started

### Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

### Install Dependencies

2. npm install

### Create .env file

3.  a. PORT=8000
    b. MONGO_URL=your_mongo_connection_string
    C. SECRET_KEY=your_jwt_secret

### Start the backend

4. npm start

### Frontend

5. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

### Install Dependencies

6. npm install

### Start the development server

7. npm run dev

### Technologies Used

Front-End: React, Tailwind
Backend: Express, Node.js, MongoDB, Mongoose
Authentication: JWT
CSV/XLSX Parsing: XLSX package
