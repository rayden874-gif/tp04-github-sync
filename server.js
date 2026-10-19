const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Create MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ضع كلمة المرور هنا إن وجدت، أو اتركه فارغاً '' إذا لم تضع كلمة مرور
  database: 'tp1_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
  
  // Create table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) throw err;
    console.log('Table "items" is ready.');
  });
});

// 1. READ (Get all items)
app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. CREATE (Add new item)
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  
  db.query('INSERT INTO items (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name });
  });
});

// 3. UPDATE (Modify item)
app.put('/api/items/:id', (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  
  db.query('UPDATE items SET name = ? WHERE id = ?', [name, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Updated successfully' });
  });
});

// 4. DELETE (Remove item)
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});