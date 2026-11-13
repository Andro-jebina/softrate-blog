# Interview Guide

Short, simple answers about how this project works.

## What does MERN mean?

- **M**ongoDB: database that stores data as documents (like JSON).
- **E**xpress.js: a Node.js framework for building the backend API.
- **R**eact: library for building the user interface.
- **N**ode.js: runs JavaScript on the server.

All four use JavaScript, so one language covers the whole app.

## How does React talk to Express?

React runs in the browser and sends HTTP requests with Axios. Example from `Home.jsx`:

```js
api.get('/blogs', { params: { limit: 3 } })
```

`api` has the base URL `/api`, so this calls `GET /api/blogs?limit=3`. In development, Vite forwards `/api` to Express. In production, Nginx does it. Express replies with JSON and React shows it.

## How does Express talk to MongoDB?

Express controllers call Mongoose models. For example `Blog.find({ status: 'Published' })` asks MongoDB for all published blogs. The connection is made once at startup in `config/db.js` using `MONGO_URI`.

## What does Mongoose do?

Mongoose lets us describe data with schemas (`models/Blog.js`): which fields exist, their types and rules such as `required` or `enum: ['Draft', 'Published']`. It validates data before saving and gives easy methods like `create`, `find`, `findById`, `findByIdAndDelete`.

## How do CRUD operations work?

| Operation | Admin action | Request | Mongoose call |
|---|---|---|---|
| Create | Submit the Add form | `POST /api/admin/blogs` | `Blog.create(...)` |
| Read | Open Manage Blogs | `GET /api/admin/blogs` | `Blog.find()` |
| Update | Save the Edit form | `PUT /api/admin/blogs/:id` | `blog.save()` |
| Delete | Click Delete and confirm | `DELETE /api/admin/blogs/:id` | `Blog.findByIdAndDelete(id)` |

After each action the admin page loads the list again from the API, so what you see always comes from the database, not from React state.

## How does the slug work?

When a blog is created, the title "My First Post!" becomes `my-first-post`. If that slug already exists, `-2`, `-3` is added so slugs stay unique. The public page `/blogs/my-first-post` fetches the blog by slug.

## How does admin login work?

1. The admin enters username and password.
2. React sends `POST /api/admin/login`.
3. Express finds the admin in MongoDB and checks the password with `bcrypt.compare` (the database only stores a hash, never the real password).
4. If correct, Express creates a JWT and sends it back.
5. React saves the token in `localStorage` and sends it with every admin request in the `Authorization: Bearer <token>` header.
6. The `protect` middleware (`middleware/auth.js`) verifies the token before any admin route runs. Without a valid token the answer is `401`.
7. Logout simply deletes the token from the browser.

React's `ProtectedRoute` also redirects to the login page when there is no token, but the real protection is on the backend.

## What is JWT?

JWT (JSON Web Token) is a signed string that proves who you are. The server signs it with a secret (`JWT_SECRET`). It cannot be changed without the secret, and it expires (here after 1 day). The server does not need to store sessions; it just verifies the signature.

## How does the homepage get blog data?

`Home.jsx` calls `GET /api/blogs?limit=3` when it loads. Express returns only blogs with status `Published`, newest first. React maps over the result and renders a `BlogCard` for each. No blog data is hardcoded in React.

## How do admin changes appear on the homepage?

Admin and public pages use the same MongoDB collection:

1. Admin creates a Published blog → saved in MongoDB.
2. A visitor opens (or refreshes) the homepage → `GET /api/blogs` reads MongoDB → the new blog is included.
3. Admin edits the title → the same document is updated → the next homepage load shows the new title.
4. Admin deletes it → the document is removed → the next homepage load no longer returns it.
5. A Draft blog is never returned by the public API, so visitors cannot see it.

## Other points worth mentioning

- Passwords are hashed with bcrypt, and password hashes are never returned by the API.
- Secrets are in `.env`, which is git-ignored.
- Search escapes special characters before building the regular expression.
- The backend listens on `127.0.0.1:5000` so only Nginx on the same server can reach it.
