const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const { title } = require('process');
const app = express();


app.use(express.static(path.join(__dirname, 'FrontEnd', 'public')));


app.set('views', path.join(__dirname, 'FrontEnd', 'views'));
app.set('view engine', 'ejs');


const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'zomato_db'
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err);
    return;
  }
  console.log('Connected to MySQL database.');
});


app.get('/api/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;
  const query = 'SELECT * FROM restaurants WHERE id = ?';
  connection.query(query, [restaurantId], (err, results) => {
    if (err) {
      console.error('Error fetching restaurant details: ', err);
      res.status(500).json({ error: 'Error fetching restaurant details' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.json(results[0]);
  });
});


app.get('/api/restaurants', (req, res) => {
  const limit = 10; 
  const page = req.query.page || 1; 
  const offset = (page - 1) * limit;
  const query = 'SELECT * FROM restaurants LIMIT ? OFFSET ?';
  connection.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error('Error fetching restaurants: ', err);
      res.status(500).json({ error: 'Error fetching restaurants' });
      return;
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.render('restaurant-list', { title: 'My App' });
});

app.get('/details/', (req, res) => {
  res.render('restaurant-detail', {title: 'Restaurant'})
});


const port = 3009;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});