# Trendy-React-App
Trendy

📌 Overview
Trendy is a modern web application that consists of three major components:

Admin Panel: A React-based dashboard for managing platform activities.

Backend: A secure Node.js and Express-powered server handling authentication, database operations, and APIs.

Frontend: A React-based user interface providing seamless interaction for end users.

🚀 Live Demo
Try out the live version of the app here: 👉 Live Demo Link 

🛠️ Tech Stack
Frontend (User Interface)
Framework: React, Vite
State Management: React Query, React Hook Form
UI Library: Ant Design, Sass
Routing: React Router
Notifications: React Toastify
Payment Integration: Paystack API
Form Validation: Yup, Formik

Admin Panel
Framework: React, Vite
UI Library: Ant Design
Routing: React Router
Real-time Updates: Socket.io
Notifications: React Toastify

Backend (API Server)
Server: Node.js, Express
Database: MongoDB (via Mongoose)
Authentication: JWT
Security: Helmet, bcryptjs
Validation: Joi, Express Validator
File Upload: Multer
Logging: Morgan
Payment Gateway: Paystack API

📥 Installation & Setup
Clone the Repository
bash
git clone https://github.com/lpharome/Trendy-React-Ap.git
Navigate into the project:

bash
cd trendy
Frontend Setup
bash
cd frontend
npm install
npm run dev
Access the app at http://localhost:5173

Admin Panel Setup
bash
cd admin-panel
npm install
npm run dev
Access the panel at http://localhost:5000

Backend Setup
bash
cd backend
npm install
npm run dev
Ensure you have a .env file with database connection details:

plaintext
DATABASE_URL=your-database-url
JWT_SECRET=your-secret-key
PAYSTACK_SECRET=your-paystack-key

✨ Deployment Guide
Frontend & Admin Panel
You can deploy the frontend and admin panel using GitHub Pages, Vercel, or Netlify.

Backend
Host the backend on Render, Heroku, or Vercel, ensuring MongoDB is connected properly.

📢 Contribution
Feel free to contribute! Fork the repository, create a feature branch, and submit a pull request.

📝 License
This project is licensed under GNU License.
