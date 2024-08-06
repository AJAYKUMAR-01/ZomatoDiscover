const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const { title } = require('process');
const app = express();

let Cache = [], sizeOfCache = 50;

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
  let Data;
  let check = true;
  Cache.forEach((restaurant) => {
    if(restaurant.id == restaurantId)
    {
      // console.log("Found in Cache");
      Data = restaurant;
      res.json(Data);
      check = false;
    }
  });

  if(!check)
  {
    ChangeOrder(Data);
  }

  if(check)
  {
    console.log("Not found in Cache");
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
    if(Cache.length >= sizeOfCache)
    {
      console.log(Cache[sizeOfCache - 1]);
      Cache.pop();
    } 
    
    ChangeOrder(results[0]);
    res.json(results[0]);
    });
  }
  // console.log(Cache);
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

app.get('/api/random', (req, res) =>{
  const query = 'SELECT * FROM restaurants ORDER BY RAND() LIMIT ?';
  connection.query(query, [1], (err, results) => {
    if (err) {
      console.error('Error fetching restaurants: ', err);
      res.status(500).json({ error: 'Error fetching restaurants' });
      return;
    }
    res.json(results[0]);
  });
});

app.get('/', (req, res) => {
  res.render('restaurant-list', { title: 'My App' });
});

app.get('/details/', (req, res) => {
  res.render('restaurant-detail', { title: 'Restaurant' })
});

app.get('/random', (req, res) => {
  res.render('restaurant-random', { title: 'Random Restaurant' })
});

function ChangeOrder(Data)
{
  let temp = [];
  temp.push(Data);
  Cache.forEach((restaurant) => {
      if(restaurant != Data)
      {
        temp.push(restaurant);
      }
  });
    Cache = temp;
}

const port = 3009;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});