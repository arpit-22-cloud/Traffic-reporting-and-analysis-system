# College Project - Backend (Node + Express + MongoDB)

Minimal backend for the college project. Built with Node.js (ES modules), Express, and Mongoose.

## What this repo contains

- app.js — main Express app wiring (project's current open file).
- server.js — server bootstrap (loads env, connects DB, starts server).
- config/
  - db.js — MongoDB connection helper.
- Controllers/
  - userController.js — user-related request handlers.
- Models/
  - userModel.js — Mongoose user schema.
  - Accident.js — accident model (domain-specific).
  - handleAsyncError.js — async error wrapper helper.
- Routes/
  - userRoutes.js — user-related routes.
- middleware/
  - error.js — global error handler.
  - userAuth.js — authentication middleware.
- utils/
  - apiFunctionality.js
  - handleError.js
  - jwtToken.js
  - sendEmail.js
- package.json — project metadata and scripts (uses ES modules: "type": "module").

> Note: Some features like cloudinary and Razorpay setup are present in `server.js` as commented code.

## Quick setup (Windows PowerShell)

1. Install dependencies

```powershell
cd "d:\Taras Backend"
npm install
```

2. Create an `.env` file in the project root with required environment variables (example below).

3. Start the development server (uses nodemon):

```powershell
npm run start
```

The server will listen on `PORT` (default 3000 if not set).

## Recommended .env (example)

Create a file named `.env` in the project root. Adapt names/values to your environment and any keys used across files.

```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=7d
CLOUDINARY_NAME=your_cloud_name    # if cloudinary is enabled
API_KEY=your_cloudinary_api_key    # if used
API_SECRET=your_cloudinary_secret  # if used
RAZORPAY_API_KEY=your_razorpay_key # if enabled
RAZORPAY_API_SECRET=your_razorpay_secret
EMAIL_USER=your@email.com          # for nodemailer/sendEmail util
EMAIL_PASS=your_email_password
```

Note: The exact env names referenced by the code may vary. `server.js` references `PORT` and (commented) cloudinary/razorpay keys. `config/db.js` likely reads your Mongo URI — update the `.env` accordingly.

## Scripts

- `npm run start` — runs `nodemon server.js` (development).
- (Add other scripts as needed: `test`, `lint`, `build`.)

## How to test endpoints quickly

Use Postman, curl, or an HTTP client. Example PowerShell curl (replace host/port and paths):

```powershell
# Example - get users (if route exists)
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users" -Method Get
```

Or with curl (if installed in PowerShell):

```powershell
curl http://localhost:3000/api/v1/users
```

## File & feature notes

- The project uses ES modules (`type: "module"` in `package.json`) — imports use `import` syntax.
- Database connection is established by `connectMongoDb()` in `config/db.js`, called from `server.js`.
- Global error handling is located in `middleware/error.js` and helper `utils/handleError.js`.
- Authentication helpers live in `middleware/userAuth.js` and `utils/jwtToken.js`.
- Email sending utility `utils/sendEmail.js` uses `nodemailer`.

## Common next steps / improvements

- Add a small `README` section for each major route (e.g., authentication, user CRUD) and example request/response shapes.
- Add basic tests (Jest/Supertest) for key endpoints.
- Add a `.env.example` file listing required env keys (without secrets) for easier onboarding.
- Add eslint/prettier and CI workflow.

## Troubleshooting

- If you see module import errors, verify `package.json` contains `"type": "module"`.
- If Mongo fails to connect, ensure `MONGO_URI` in `.env` is correct and network access to the DB is enabled.
- Check `server.js` for uncaughtException/unhandledRejection handlers — they will terminate the process for safety.

---

If you'd like, I can:
- Add a `.env.example` file next.
- Expand the README with specific API endpoints and examples by reading `Routes/userRoutes.js` and `Controllers/userController.js` (I can extract exact paths and payloads).
- Add a short `make test` or Jest setup.

Tell me which follow-up you prefer and I'll implement it.
