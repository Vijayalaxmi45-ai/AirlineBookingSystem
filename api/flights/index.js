const mysql = require('mysql2/promise');

async function getConnection() {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'airline_booking',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
  });
}

module.exports = async (req, res) => {
  const pool = await getConnection();
  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT id, flight_number, airline, origin, destination, departure, arrival, seats, price FROM flights ORDER BY id DESC');
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { flight_number, airline, origin, destination, departure, arrival, seats, price } = req.body;
      if (!flight_number || !origin || !destination) return res.status(400).json({ error: 'invalid' });
      const [result] = await pool.query(
        'INSERT INTO flights (flight_number, airline, origin, destination, departure, arrival, seats, price) VALUES (?,?,?,?,?,?,?,?)',
        [flight_number, airline, origin, destination, departure || null, arrival || null, seats || 0, price || 0]
      );
      return res.status(201).json({ id: result.insertId });
    }

    res.setHeader('Allow', ['GET','POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
};
