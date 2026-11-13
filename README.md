# Softrate Blog (MERN)

A simple blog website built with MongoDB, Express, React and Node.js. Visitors can read published blogs, search them and send a contact message. An administrator can log in and create, read, update and delete blogs and manage contact messages. Every change is saved in MongoDB and shows up on the public website.

## Technologies

- **Frontend:** React 18, Vite, React Router DOM, Axios, plain CSS
- **Backend:** Node.js, Express, Mongoose, JWT (`jsonwebtoken`), bcrypt (`bcryptjs`), `cors`, `dotenv`
- **Database:** MongoDB (MongoDB Atlas)

## Project structure

```
blog/
├── client/                     React app (Vite)
│   ├── public/                 favicon
│   └── src/
│       ├── components/         Navbar, Footer, BlogCard, PublicLayout, ProtectedRoute
│       ├── pages/              Home, Blogs, BlogDetail, About, Contact, NotFound
│       ├── admin/              AdminLogin, AdminLayout, Dashboard, ManageBlogs, BlogForm, Messages
│       ├── services/api.js     Axios instance (base URL "/api"), token helpers
│       ├── App.jsx             All routes
│       ├── main.jsx            Entry point
│       └── index.css           All styles
├── server/
│   ├── config/db.js            MongoDB connection
│   ├── models/                 Admin, Blog, Contact (Mongoose schemas)
│   ├── controllers/            Logic for auth, blogs, contact/stats
│   ├── routes/                 publicRoutes.js, adminRoutes.js
│   ├── middleware/             auth.js (JWT check), errorHandler.js
│   ├── scripts/seedAdmin.js    Creates the first admin
│   ├── server.js               Express app entry point
│   └── .env.example            Copy to .env
├── .gitignore
├── README.md
└── INTERVIEW_GUIDE.md
```

## Local setup

You need Node.js 18+ and a MongoDB database (Atlas is easiest).

### 1. MongoDB Atlas

1. Create a free account and a free cluster at https://www.mongodb.com/atlas.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → add your current IP (for the VPS later, add the VPS public IP).
4. **Connect → Drivers** → copy the connection string and put your database name in it, for example `.../softrate-blog?retryWrites=true&w=majority`.

### 2. Backend

```bash
cd server
npm install
cp .env.example .env        # then edit .env
npm run seed                # creates the admin account
npm run dev                 # starts http://127.0.0.1:5000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev                 # opens http://localhost:5173
```

The Vite dev server forwards `/api` requests to the backend on port 5000, so no API URL is hardcoded anywhere.

## Environment variables (`server/.env`)

| Variable | Meaning |
|---|---|
| `PORT` | Backend port (5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` |
| `ADMIN_USERNAME` | Username for the seeded admin |
| `ADMIN_PASSWORD` | Password for the seeded admin (hashed with bcrypt before saving) |
| `CLIENT_URL` | Dev frontend origin for CORS |

The real `.env` is in `.gitignore` and must never be committed.

## Admin account and login

Run `npm run seed` inside `server/`. It reads `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`, hashes the password with bcrypt and stores it in MongoDB. Running it again does nothing if the admin already exists.

**Demo login (from `.env.example`):**

- URL: `http://localhost:5173/admin/login`
- Username: `admin`
- Password: `Admin@12345`

**Before production:** change `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `JWT_SECRET` in `.env`. If the admin was already seeded with the old password, delete that admin document in Atlas (collection `admins`) and run `npm run seed` again. There is no public registration.

The database starts empty, so the public site shows "No blog posts yet" until you add and publish blogs from the admin panel.

## Admin panel

| Route | Purpose |
|---|---|
| `/admin/login` | Login |
| `/admin/dashboard` | Totals: blogs, published, drafts, messages |
| `/admin/blogs` | List, view, edit, delete blogs |
| `/admin/blogs/add` | Create blog |
| `/admin/blogs/edit/:id` | Edit blog |
| `/admin/messages` | Read and delete contact messages |

## Production build and VPS deployment

Architecture: **Nginx** serves the React build and proxies `/api/` to **Express** (managed by **PM2**, listening on `127.0.0.1:5000` only). The database is **MongoDB Atlas**, so nothing database-related runs on the VPS.

Directories: app code in `/srv/softrate-blog/`, React build in `/var/www/softrate-blog/`.

```bash
# Frontend build (creates client/dist)
cd client && npm install && npm run build
# copy the contents of client/dist to /var/www/softrate-blog/

# Backend
cd /srv/softrate-blog/server && npm install --omit=dev
# create .env with real values, then:
npm run seed
pm2 start server.js --name softrate-blog
pm2 save
```

Example Nginx server block (add it as a **new** file; do not edit existing ones). With no domain yet, use a spare port or a `server_name` that does not clash with your other sites:

```nginx
server {
    listen 8080;                       # choose a free port, or use 80 with a proper server_name
    server_name _;

    root /var/www/softrate-blog;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri /index.html;    # makes React Router page refreshes work
    }
}
```

Exact VPS commands depend on the server and will be done after inspecting it. Remember to add the VPS public IP to the Atlas Network Access list.

## API endpoints

Public:

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/blogs` | Published blogs only. Optional `?search=` and `?limit=` |
| GET | `/api/blogs/:slug` | One published blog |
| POST | `/api/contact` | Save a contact message |

Admin (all except login need `Authorization: Bearer <token>`):

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/admin/login` | Returns a JWT |
| GET | `/api/admin/profile` | Current admin |
| GET | `/api/admin/stats` | Dashboard numbers |
| GET | `/api/admin/blogs` | All blogs (drafts and published) |
| GET | `/api/admin/blogs/:id` | One blog, used by the edit form |
| POST | `/api/admin/blogs` | Create (slug generated from title) |
| PUT | `/api/admin/blogs/:id` | Update |
| DELETE | `/api/admin/blogs/:id` | Delete |
| GET | `/api/admin/messages` | All messages |
| DELETE | `/api/admin/messages/:id` | Delete a message |

Two small additions beyond the list in the brief: `GET /api/admin/stats` (dashboard numbers) and `GET /api/admin/blogs/:id` (edit form loading).

## Manual test checklist

1. Log in at `/admin/login` with the demo credentials; a wrong password shows an error.
2. Add a blog with status **Published** → it appears on `/` and `/blogs`.
3. Add another with status **Draft** → it does not appear publicly, and its URL shows "Blog not found".
4. Edit the title → refresh `/` and see the new title.
5. Delete the blog (confirm dialog) → refresh `/`, it is gone.
6. Send a message from `/contact` → read and delete it in `/admin/messages`.
7. Click Logout, then open `/admin/dashboard` → redirected to login.
