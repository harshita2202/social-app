# 🌐 Social App

A full-stack social media web app inspired by the TaskPlanet Social UI — built with React, Node.js/Express, and MongoDB.

---

## Features
- **Account Creation** — Signup & Login with email/password (JWT auth)
- **Create Post** — Text, image, or both (either one is enough)
- **Public Feed** — All posts visible with tabs: All Post, For You, Most Liked, Most Commented
- **Like & Unlike** — Toggle likes; shows who liked
- **Comments** — Add comments; shows commenter usernames
- **Search** — Filter posts by username or content
- **Persistent auth** — Stays logged in across refreshes

---

##  Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (MongoDB Atlas)

---

### 1. Clone / Extract the project
```
social-app/
├── backend/
└── frontend/
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```


Start the backend:
```bash
npm start
# or for dev with auto-reload:
npm run dev   # requires: npm install -g nodemon
```

Backend runs at: `http://localhost:5000`

---

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

> The `"proxy": "http://localhost:5000"` in `frontend/package.json` automatically forwards `/api` requests to the backend.

---

##  Project Structure

```
backend/
├── server.js          # Express app entry point
├── .env               # Environment variables
├── models/
│   ├── User.js        # User schema
│   └── Post.js        # Post schema (with likes/comments)
├── routes/
│   ├── auth.js        # POST /api/auth/signup, /api/auth/login
│   └── posts.js       # GET/POST /api/posts, like, comment
├── middleware/
│   └── auth.js        # JWT middleware
└── uploads/           # Uploaded images (auto-created)

frontend/
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── index.css        # All styles (Social App UI)
    ├── context/
    │   └── AuthContext.js
    ├── pages/
    │   ├── Login.js
    │   ├── Signup.js
    │   └── Feed.js       # Main social feed page
    └── components/
        ├── CreatePost.js  # Post creation box
        └── PostCard.js    # Individual post with like/comment
```

---

##  API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns token |
| GET | `/api/posts` | No | Get all posts |
| POST | `/api/posts` | Yes | Create a post (text/image) |
| POST | `/api/posts/:id/like` | Yes | Toggle like on a post |
| POST | `/api/posts/:id/comment` | Yes | Add comment to a post |

---

## Website live on 
https://social-app-henna-omega.vercel.app/
