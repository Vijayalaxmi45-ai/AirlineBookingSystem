/**
 * Minimal Express API to manage flights.
 * Usage: set environment variables from .env or use defaults.
 */
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static('.'));

async function getConnection() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'airline_booking'
  });
  return conn;
}

app.get('/api/flights', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id, flight_number, airline, origin, destination, departure, arrival, seats, price FROM flights ORDER BY id DESC');
    await conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'db_error' });
  }
});

app.post('/api/flights', async (req, res) => {
  const { flight_number, airline, origin, destination, departure, arrival, seats, price } = req.body;
  if (!flight_number || !origin || !destination) return res.status(400).json({ error: 'invalid' });
  try {
    const conn = await getConnection();
    const [result] = await conn.execute(
      'INSERT INTO flights (flight_number, airline, origin, destination, departure, arrival, seats, price) VALUES (?,?,?,?,?,?,?,?)',
      [flight_number, airline, origin, destination, departure || null, arrival || null, seats || 0, price || 0]
    );
    await conn.end();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'db_error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
