# Architecture Report — Alzikrayat Photo Sharing Application (MERN Edition)

**Course Project 3 — Advanced Web Technologies**
**Sudan University of Science and Technology, College of CS & IT**

## 1. Overview

Alzikrayat is a photo-sharing web application rebuilt on the full **MERN stack**:
MongoDB (with Mongoose), Express.js, React.js (Vite), and Node.js. It is the
successor of Project 1, which was written in hand-written PHP using the MVC
pattern. Users can register, log in, upload photos, browse a gallery in four
display styles, open a photo, comment on it, and delete their own photos.

No meta-framework (Next.js, NestJS) and no pre-built dashboard is used. Every
Express route, controller, middleware, and React component is hand-written.

## 2. Three-Tier Architecture

The application keeps a strict separation between three tiers. Each tier is a
different technology, and communication is one-directional:
the browser talks to Express, and only Express talks to the database.

```
 ┌──────────────────────┐   HTTP / JSON    ┌──────────────────────┐   Mongoose    ┌──────────────────┐
 │  1. PRESENTATION     │ ───────────────► │  2. APPLICATION      │ ────────────► │  3. DATA         │
 │  React (Vite)        │ ◄─────────────── │  Express REST API    │ ◄──────────── │  MongoDB         │
 │  pages, components   │                  │  routes, controllers │               │  users, photos,  │
 │  React Router        │                  │  middleware          │               │  comments        │
 └──────────────────────┘                  └──────────┬───────────┘               └──────────────────┘
                                                      │ multer
                                                      ▼
                                              server/uploads/ (image files)
```

| Tier | Technology | Location in codebase |
|---|---|---|
| Presentation (browser) | React, React Router, Bootstrap grid, custom CSS | `client/src/pages`, `client/src/components` |
| Application (server logic) | Express REST API, Joi, multer, bcryptjs | `server/routes`, `server/controllers`, `server/middleware` |
| Data (persistent) | MongoDB + Mongoose schemas | `server/models` |

## 3. What Changed from the PHP MVC Version

The MVC idea still exists, but each role moved to a new technology.

| Concern | Project 1 (PHP MVC) | Project 3 (MERN) |
|---|---|---|
| View | PHP templates rendered on the server | React components rendered in the browser |
| Controller | PHP controller classes | Express controllers |
| Model | PHP classes with raw SQL (PDO) | Mongoose schemas and models |
| Routing | Hand-written regex router | Express routes (server) + React Router (browser) |
| Database | MySQL (relational) | MongoDB (document) |
| Page loading | Full page reload on every click | Single-page application, data fetched as JSON |
| Login state | PHP session + "last login" cookie | React state + localStorage + `X-User-Id` header |
| XSS defence | `htmlspecialchars()` | React escapes rendered text automatically |
| Deleting related data | `ON DELETE CASCADE` | Controller deletes the photo's comments explicitly |

## 4. Project Structure

```
alzikrayat-mern/
├── server/
│   ├── server.js            Entry point: loads .env, mounts routes, connects MongoDB, listens
│   ├── models/              User.js, Photo.js, Comment.js (Mongoose schemas)
│   ├── routes/              authRoutes.js, photoRoutes.js, commentRoutes.js
│   ├── controllers/         authController.js, photoController.js, commentController.js
│   ├── middleware/          validation.js (Joi), auth.js, upload.js (multer), errorHandler.js
│   ├── uploads/             stored image files (not committed)
│   └── .env                 MONGODB_URI, PORT (not committed)
└── client/
    ├── index.html           Single empty page containing <div id="root">
    ├── vite.config.js       Dev server and proxy to Express
    └── src/
        ├── main.jsx         Entry point: starts React
        ├── App.jsx          Route table (URL → page)
        ├── api.js           Single place that calls the REST API
        ├── index.css        Theme (colours, fonts, layout)
        ├── pages/           Home, Gallery, PhotoDetail, AddPhoto, LoginRegister, About
        ├── components/      Layout, Navbar, PhotoCard, PhotoListRow, Slider, CommentForm, ...
        ├── context/         AuthContext.jsx (logged-in user)
        └── hooks/           useFetch.js (load data with loading and error state)
```

## 5. Backend (Application and Data Tiers)

### 5.1 Startup
`server.js` is the entry point. It loads `.env`, registers CORS, the JSON body
parser, and a static route for `/uploads`, mounts the three route files, adds the
404 and error handlers (last, because Express passes errors to the final handler),
connects to MongoDB with Mongoose, and only then calls `app.listen`.

### 5.2 Request pipeline
Each route is a chain executed left to right. If a step fails, the chain stops and
the client receives the matching HTTP status code.

```js
router.post('/api/photos', requireUser, upload.single('photo'), validate('photo'), photoController.create);
```

1. `requireUser` confirms the user exists in the database (`401` otherwise). It runs
   before multer so unauthenticated requests never write a file.
2. `upload.single('photo')` stores the image on disk (JPG, PNG, GIF, WEBP; max 5 MB;
   random file name).
3. `validate('photo')` checks the body with a Joi schema (`400` otherwise).
4. `photoController.create` saves the metadata through the Mongoose model.

### 5.3 Models (Mongoose)
- **User:** `firstName`, `lastName`, `email` (required, unique, lowercase, format check),
  `password` (bcrypt hash, `select: false`), optional `location`, `description`, `occupation`.
- **Photo:** `userId` (ref User), `fileName`, `title`, `description`, `dateTime`.
- **Comment:** `photoId` (ref Photo), `userId` (ref User), `comment`, `dateTime`.

References between collections replace SQL foreign keys. `populate()` replaces a stored
id with the referenced document's fields (for example the author's name) when reading.

### 5.4 REST API

| Method | Route | Access | Purpose | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | public | Validate, hash password, create user | 201 |
| POST | `/api/auth/login` | public | Compare with bcrypt hash, return public profile | 200 |
| GET | `/api/photos` | public | List photos (newest first, with author and comment count) | 200 |
| GET | `/api/photos/:id` | public | One photo | 200 |
| POST | `/api/photos` | logged in | Upload photo (multipart) | 201 |
| DELETE | `/api/photos/:id` | owner only | Delete record, its comments, and the file | 204 |
| GET | `/api/photos/:id/comments` | public | Comments, oldest first | 200 |
| POST | `/api/photos/:id/comments` | logged in | Add comment | 201 |

Error codes: `400` invalid data, `401` not logged in, `403` not the owner, `404` not found,
`409` duplicate email, `500` unexpected server error.

## 6. Frontend (Presentation Tier)

### 6.1 Startup and routing
`index.html` provides an empty `<div id="root">`. `main.jsx` renders the application into it,
wrapped in `BrowserRouter` (URL routing) and `AuthProvider` (login state). `App.jsx` maps URLs
to pages, all inside a `Layout` component that renders the sidebar once.

| URL | Page |
|---|---|
| `/` | Home (hero, stats, recent photos) |
| `/photos` | Gallery (4 display styles + search) |
| `/photos/new` | AddPhoto (login required) |
| `/photos/:id` | PhotoDetail (read with `useParams`) |
| `/login`, `/register` | LoginRegister |
| `/about` | About |

### 6.2 React concepts used
- **Components and props:** pages are built from reusable components. A parent passes data
  to a child through props, for example `<PhotoCard photo={photo} />`.
- **State (`useState`):** each component keeps the data that changes (form text, comment list).
  When state changes React updates its Virtual DOM, compares it with the previous version, and
  updates only the changed parts of the real DOM, so pages never reload.
- **Effects (`useEffect`):** run the data fetch when a page opens or when its URL changes.
- **Custom hook (`useFetch`):** wraps fetch + `useEffect` + state and returns `data`, `loading`,
  and `error`, so every page shows a spinner or an error message consistently.
- **Context (`AuthContext`):** stores the logged-in user once and makes it available to any
  component (sidebar, comment form, delete button) without passing props through every level.
- **Parent–child communication:** data flows down through props; events flow up by calling a
  function received as a prop (for example `CommentForm` calls `onAdded(comment)` and
  `PhotoDetail` adds it to its comment list, so the comment appears immediately).

### 6.3 API access
`api.js` wraps `fetch`. It attaches the `X-User-Id` header, sends JSON or `FormData`, and converts
non-2xx responses into errors carrying the server's messages. In development, the Vite proxy
forwards `/api` and `/uploads` to Express on port 5000, so the browser only talks to port 5173.

## 7. Authentication and Session State

Passwords are hashed with bcrypt (`bcryptjs`, 10 rounds) before storage and are never returned:
the schema hides the field from queries and `toPublic()` builds a safe profile object.
On login the server returns the public profile; React stores it in `AuthContext` and mirrors it to
`localStorage`, so a page refresh keeps the user logged in. The toolbar shows "Hi, <firstName>" and
Logout when logged in, or "Please Login" when logged out.

Write routes send the user id in the `X-User-Id` header, and `requireUser` verifies that user exists.
Deleting a photo additionally compares the photo's owner with the logged-in user on the server
(`403` if different), so hiding the Delete button is not the only protection.

**Limitation:** per the Project 3 scope this is basic authentication. The header is not tamper-proof.
JWT tokens, protected-route middleware, and refresh tokens are the planned Bonus Project 4 upgrade.

## 8. Validation Strategy (Three Layers)

1. **Browser:** HTML5 attributes (`required`, `pattern`, `minLength`, `type="email"`) and
   `checkValidity()` in the React forms give immediate feedback.
2. **Server:** Joi schemas validate every request body that writes data and strip unknown fields.
3. **Database:** Mongoose schema rules (`required`, `unique`, `maxlength`, `match`) are the final safety net.

## 9. Security Summary

- Passwords stored only as bcrypt hashes; hash hidden from queries and responses.
- Server-side validation (Joi) plus schema validation (Mongoose).
- React escapes all rendered text, which prevents XSS from titles, descriptions, and comments.
- Uploads restricted by MIME type and size, stored with random names.
- Ownership of a photo verified on the server before deletion.
- Secrets (`MONGODB_URI`) kept in `.env`, which is excluded from Git via `.gitignore`; a
  `.env.example` template documents the required variables.

## 10. Running the Project

The two programs start independently and meet only when React sends a request.

```bash
npm run install:all                 # installs server and client dependencies
cd server && cp .env.example .env   # then set MONGODB_URI
npm run dev --prefix server         # API on http://localhost:5000
npm run dev --prefix client         # React on http://localhost:5173
```

## 11. Conclusion

Every requirement of the Project 3 specification is implemented in a traceable location: a
React front end with routing and reusable components, an Express REST API with Joi validation
and error middleware, Mongoose schemas with references, bcrypt-hashed authentication, owner-only
deletion, multer uploads, and instant comment updates. The Presentation, Application, and Data
tiers remain cleanly separated, and the original Alzikrayat design is preserved.

## Student Info

Student Name: Arwa Ahmed Ali
Student ID: 202021022192
Department: Software Engineering
