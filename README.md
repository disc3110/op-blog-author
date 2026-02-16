# ✍️ Blog Author Dashboard

This project is the **author/admin frontend** for a full-stack blog platform.
It allows blog authors to **log in, manage posts, publish/unpublish content, and moderate comments**, all through a clean React dashboard.

This repository is **one of three separate apps** that together form the full blog system:

1. **Backend API** – Express, Prisma, PostgreSQL, JWT
2. **Author Dashboard (this repo)** – React + Tailwind
3. **Public Blog Frontend** – React (read, comment, like posts)

Keeping them in separate repositories allows clean architectures and independent deployments.

## 🚀 Live Demo

Public App: 
Author Dashboard: https://op-blog-author-production.up.railway.app
Public Dashboard: https://op-blog-public-production.up.railway.app

Backend API: https://github.com/disc3110/op-blog-api


You can log in using the following **mock author account**:

```json
{
  "name": "Author User",
  "email": "author@example.com",
  "password": "password123"
}
```

This demo account has author permissions and can be used to explore all features of the dashboard.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login for authors
- Protected routes
- Token stored in `localStorage`
- Logout support

### 📝 Post Management
- Paginated list of posts
- Draft vs published status
- Create new posts
- Edit existing posts
- Publish / unpublish posts
- Comment & like counters per post

### 💬 Comment Moderation
- View comments per post
- See author, date, and likes
- Delete comments
- Paginated comments list

### 🔔 Global Notifications
- Global success & error toast notifications
- Used across all major actions
- Non-blocking UI feedback

### 🎨 UI / UX
- Tailwind CSS
- Responsive dashboard layout
- Loading & empty states

---

## 🧱 Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State:** React Hooks
- **API:** Fetch API
- **Auth:** JWT
- **Linting:** ESLint

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── PostForm.jsx
│   ├── ProtectedRoute.jsx
│   ├── StatusBadge.jsx
│   └── ToastProvider.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── NewPostPage.jsx
│   └── EditPostPage.jsx
├── services/
│   ├── apiClient.js
│   ├── authService.js
│   ├── postService.js
│   └── commentService.js
├── App.jsx
└── main.jsx
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

App runs at:
```
http://localhost:5173
```

Make sure the backend API is running.

---

## 🔗 Related Repositories

- **Backend API (Express + Prisma + PostgreSQL + JWT):**  
  https://github.com/disc3110/op-blog-api

- **Public Blog Frontend (React – read, comment, like posts):**  
  https://github.com/disc3110/op-blog-public

---

## 📌 Future Improvements

- Rich text editor (TinyMCE / TipTap)
- Post preview mode
- Comment editing
- Role-based permissions
- Image uploads

---

## 👤 Author

Built by **Diego** as a full-stack portfolio project.

---

## 📄 License

MIT
