# AirlineBookingSystem (SkyWings) — Local DB + Deploy Instructions

This repository contains a static front-end for an airline booking demo.

Files added:
- `create_database.sql` — MySQL schema and a small seed row
- `.env.example` — example DB credentials (local)

Quick local DB setup (MySQL on your laptop)

1. Ensure MySQL server is running and you can connect as `root` with password `root`.
2. Import the schema:

```bash
# If your root password is `root`:
mysql -u root -proot < create_database.sql

# Or prompt for password
mysql -u root -p < create_database.sql
```

3. Verify database exists:

```bash
mysql -u root -proot -e "SHOW DATABASES LIKE 'airline_booking';"
```

Notes about the project
- This repo is currently a static frontend (HTML/CSS/JS). There is no backend server code included to read/write the MySQL database. To use the DB you must implement a backend API (Node/Express, PHP, Python, etc.) and set environment variables from `.env.example`.

Push to your GitHub repository

From the project root run:

```bash
git init
git add .
git commit -m "Add project files and DB schema"
git branch -M main
git remote add origin https://github.com/Vijayalaxmi45-ai/AirlineBookingSystem.git
git push -u origin main
```

Deploy to Vercel (import from GitHub)

1. Go to https://vercel.com and sign in.
2. Click "Import Project" → choose GitHub and authorize if needed.
3. Select `Vijayalaxmi45-ai/AirlineBookingSystem` repository and import.
4. For a static site, Vercel will deploy automatically. If you add a backend, you will need a separate server or serverless functions and a hosted DB (Vercel cannot directly connect to a DB running only on your laptop).

Environment variables on Vercel
- If you create a backend or serverless functions, set DB variables in Vercel's dashboard (Settings → Environment Variables). Do NOT commit production secrets to the repo.

If you want, I can:
- Add a minimal Node.js + Express API that uses the `create_database.sql` schema and exposes endpoints for flights and bookings.
- Try to commit and push these changes to your GitHub repo from this machine (you may be prompted to authenticate).
- Provide step-by-step help importing the repo into Vercel and setting environment variables.

Backend (optional) — quick start

This repo now includes a minimal Node.js + Express API in `server.js` that exposes `/api/flights` for GET and POST.

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (not committed) or set environment variables. Example `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=airline_booking
DB_USER=root
DB_PASS=root
```

3. Run the server:

```bash
npm run dev   # or `npm start` in production
```

4. Open http://localhost:3000/admin.html to manage flights (add/list).

Offline support (service worker)
- A `sw.js` service worker is included and registered from the main `js/script.js`. It caches HTML/CSS/JS assets so the site will still show styling when offline after the page has been visited once.

Notes & next steps
- The backend uses MySQL to persist flights. Run `create_database.sql` to create the schema before inserting flights via the admin page.
- I can help: secure auth for the admin page, validation, pagination, and deploy the server to a host (Heroku, Render, or similar) and use a managed MySQL instance so Vercel frontend can call the API.
