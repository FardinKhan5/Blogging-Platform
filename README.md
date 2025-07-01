# 📝 Blogging Platform (MERN Stack)

A full-stack blogging application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can sign up, create and edit blog posts using a rich-text editor, like and comment on posts, and explore articles by title or tags.

---

## 🚀 Features

- 🔐 **Authentication**: Secure user registration and login using JWT
- ✍️ **Rich Text Editor**: Create posts with formatted content (React Quill)
- 🖼️ **Image Upload**: Upload cover images using Cloudinary
- 📑 **CRUD Operations**: Full blog post management
- 🧾 **Comments & Likes**: Engage with posts
- 🧵 **Tags & Search**: Discover content via tags or search
- 📊 **User Dashboard**: Manage posts in one place
- ⚙️ **Responsive UI**: Built with Tailwind CSS & DaisyUI

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Redux Toolkit
- React Router
- Axios
- React Quill
- Tailwind CSS / Material UI

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary + Multer (for image upload)
- JWT (Authentication)
- Bcrypt (Password Hashing)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js & npm
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/FardinKhan5/Blogging-Platform.git
cd blogging-platform
```
### 2. Setup Backend

```bash
cd server
npm install
```
#### Create a `.env` file in `server/` with:

```bash
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
#### Run backend server:
```bash
node server.js
```
### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
#### Create a `.env` file in `frontend/` with:

```bash
VITE_API_URL=http://localhost:5000/api
```
#### Run frontend:
```bash
npm run dev
```
---
## 🌐 Deployment

Frontend deployed on **Render**  
Backend deployed on **Render**  
Database hosted on **MongoDB Atlas**

- 🔗 <a href="https://blogging-platform-opg2.onrender.com/" target="_blank">Live Site </a>
---
