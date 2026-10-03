import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 5000);
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'eggrolluser',
  password: process.env.DB_PASSWORD || 'eggrollpass',
  database: process.env.DB_NAME || 'eggrollshop',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'ok' }); }
  catch (e) { res.status(503).json({ status: 'error', database: 'unavailable' }); }
});

app.get('/api/products', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description, price, category, image_url FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ message: 'Unable to load products' }); }
});

app.post('/api/orders', async (req, res) => {
  const { customerName, phone, items, total } = req.body || {};
  if (!customerName || !phone || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Invalid order' });
  try {
    const [result] = await pool.query('INSERT INTO orders (customer_name, phone, items_json, total) VALUES (?, ?, ?, ?)', [customerName, phone, JSON.stringify(items), Number(total || 0)]);
    res.status(201).json({ id: result.insertId, message: 'Order placed successfully' });
  } catch (e) { res.status(500).json({ message: 'Unable to place order' }); }
});

app.listen(port, '0.0.0.0', () => console.log(`EggRoll API listening on ${port}`));
