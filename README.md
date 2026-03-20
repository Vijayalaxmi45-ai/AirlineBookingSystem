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
