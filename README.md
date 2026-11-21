# Alzikrayat 📷 — MERN Edition

Course Project 3 — Advanced Web Technologies, Sudan University of Science & Technology (SUST)

A full-stack photo-sharing app rebuilt from the PHP/MVC original (Project 1) on the **MERN stack**:
**M**ongoDB (Mongoose) · **E**xpress REST API · **R**eact (Vite) · **N**ode.js.
The warm, editorial "living album" design (sticky sidebar, hero landing page, Fraunces/Inter type, maroon/gold palette, scroll animations) is carried over unchanged.

## Architecture (3-Tier)

| Tier | Technology | Location |
|---|---|---|
| Presentation | React + React Router (Vite) | `client/src/components`, `client/src/pages` |
| Application | Express REST API, Joi validation, error middleware | `server/routes`, `server/controllers`, `server/middleware` |
| Data | MongoDB + Mongoose schemas | `server/models` |

```
alzikrayat-mern/
├── server/
│   ├── models/        User.js, Photo.js, Comment.js
│   ├── routes/        authRoutes.js, photoRoutes.js, commentRoutes.js
│   ├── controllers/   authController.js, photoController.js, commentController.js
│   ├── middleware/    validation.js (Joi), errorHandler.js, auth.js, upload.js (multer)
│   ├── uploads/       stored image files
│   ├── .env           MONGODB_URI, PORT (not committed)
│   └── server.js
└── client/
    ├── src/
    │   ├── components/  Navbar, Layout, PhotoCard, PhotoListRow, Slider, CommentForm, CommentList, LoginForm, RegisterForm...
    │   ├── pages/       Home, Gallery, PhotoDetail, AddPhoto, LoginRegister, About
    │   ├── context/     AuthContext.jsx (logged-in user state)
    │   ├── App.jsx      routes
    │   └── main.jsx
    ├── index.html
    └── vite.config.js   dev proxy to Express
```

## Setup

Requirements: Node.js 18+ and a MongoDB instance (local or MongoDB Atlas).

```bash
# 1. Install dependencies
npm run install:all          # or: npm install in /server and /client

# 2. Configure the server
cd server
cp .env.example .env         # then edit MONGODB_URI if needed

# 3. Run (two terminals)
npm run dev --prefix server  # API on http://localhost:5000
npm run dev --prefix client  # React on http://localhost:5173
```

Open **http://localhost:5173**. Vite proxies `/api` and `/uploads` to Express.

### Environment variables (`server/.env`)

| Variable | Purpose | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/alzikrayat` |
| `PORT` | API port | `5000` |
| `CLIENT_ORIGIN` | Origin allowed by CORS | `http://localhost:5173` |

`.env` is git-ignored; never commit it.

## REST API

| Method | Route | Auth | Description | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | – | Validate (Joi), bcrypt-hash password, create user | 201 |
| POST | `/api/auth/login` | – | Compare with bcrypt hash, return public profile | 200 |
| GET | `/api/photos` | – | All photos (newest first, with author + comment count) | 200 |
| GET | `/api/photos/:id` | – | One photo | 200 |
| POST | `/api/photos` | user | Multipart upload (`photo`, `title`, `description`) | 201 |
| DELETE | `/api/photos/:id` | owner | Delete record, comments, and file | 204 |
| GET | `/api/photos/:id/comments` | – | Comments, oldest first | 200 |
| POST | `/api/photos/:id/comments` | user | Add a comment | 201 |

Errors: `400` validation, `401` not logged in, `403` not the owner, `404` not found, `409` duplicate email.

## Features

- Register / Login with bcrypt; toolbar shows **Hi, \<firstName\>** + Logout, or **Please Login**
- Gallery fetched with `useEffect` + `fetch`, in four display styles (3-col, 4-col, list, slider) plus search
- Photo upload (JPG/PNG/GIF/WEBP, max 5 MB), detail view via `useParams`, owner-only delete (checked server-side)
- Comments update instantly without a page reload
- Loading and error states on every view; responsive layout with a collapsing mobile sidebar

## Security notes

- Passwords are stored only as bcrypt hashes (`select: false` keeps them out of queries); responses return the public profile only.
- Every write body is validated server-side with Joi; Mongoose schemas add a second validation layer.
- React escapes all rendered text (XSS); uploads are restricted by MIME type and size, with random file names.
- Per the Project 3 scope, authentication is basic: the client keeps the user in React state/localStorage and sends the user id in an `X-User-Id` header, which the server checks against the database. This is **not** tamper-proof; JWT tokens and protected-route middleware are the Bonus Project 4 upgrade.
- `bcryptjs` (pure-JS bcrypt implementation) is used so installs work without native build tools; swap for `bcrypt` if your course requires the native package.

## Student Info

Student Name: Arwa Ahmed Ali
Student ID: 202021022192
Department: Software Engineering
