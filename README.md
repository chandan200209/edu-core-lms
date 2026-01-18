# 📚 MERN Learning Management System (LMS)

A **full-stack Learning Management System - EduCore** built using the **MERN Stack**, designed to let educators publish courses and learners watch lectures seamlessly—with secure authentication, media handling, and payments baked in.

This project is engineered with scalability in mind and uses modern tooling across the stack. Think **EdTech, but with clean architecture and real-world integrations**.

---

## 🚀 Features

### 👨‍🏫 Educator
- Create & publish courses
- Upload lectures (video + content)
- Rich text course descriptions using Quill
- Course pricing & monetization via Stripe

### 👩‍🎓 Student
- Browse & purchase courses
- Watch lectures with progress tracking
- Rate and review courses
- Resume learning anytime

### 🔐 Platform
- Authentication & user management with **Clerk**
- Secure payments using **Stripe**
- Media storage & optimization via **Cloudinary**
- Scalable MongoDB data layer
- Modern UI powered by React + Tailwind

---

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **React Router DOM 7**
- **Tailwind CSS (Vite)**
- **Clerk React**
- **Axios**
- **Quill**
- **React YouTube**
- **React Toastify**
- **React Simple Star Rating**
- **RC Progress**
- **Humanize Duration**

### Backend
- **Node.js**
- **Express 5**
- **MongoDB + Mongoose**
- **Clerk (Express SDK)**
- **Stripe**
- **Cloudinary**
- **Multer**
- **Svix (Webhook handling)**
- **CORS**
- **dotenv**

---

## 📦 Dependencies Snapshot

### Backend
```json
{
  "@clerk/express": "^1.7.62",
  "cloudinary": "^2.8.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "mongoose": "^9.1.4",
  "multer": "^2.0.2",
  "nodemon": "^3.1.11",
  "stripe": "^20.1.2",
  "svix": "^1.42.0"
}
```
