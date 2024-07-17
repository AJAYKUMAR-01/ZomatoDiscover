const mysql = require('mysql2');
const fs = require('fs');


const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'zomato_db'
});


const data = JSON.parse(fs.readFileSync('dataFile.json', 'utf8'));


const createTableQuery = `
  CREATE TABLE IF NOT EXISTS restaurants (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    url VARCHAR(255),
    average_cost_for_two INT,
    cuisines VARCHAR(255),
    user_rating FLOAT,
    rating_text VARCHAR(255),
    rating_color VARCHAR(6),
    votes INT,
    has_online_delivery BOOLEAN,
    location_address VARCHAR(255),
    location_city VARCHAR(255),
    location_latitude FLOAT,
    location_longitude FLOAT,
    featured_image VARCHAR(255)
  )
`;

connection.query(createTableQuery, (err, results, fields) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Table created or already exists.');

 
  data.forEach(entry => {
    const arr = entry.restaurants || [];
    arr.forEach(item => {
      const restaurant = item.restaurant;
      if (restaurant && restaurant.R && restaurant.R.res_id) {
        const insertQuery = `
          INSERT INTO restaurants (id, name, url, average_cost_for_two, cuisines, user_rating, rating_text, rating_color, votes, has_online_delivery, location_address, location_city, location_latitude, location_longitude, featured_image)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          restaurant.R.res_id,
          restaurant.name,
          restaurant.url,
          restaurant.average_cost_for_two,
          restaurant.cuisines,
          parseFloat(restaurant.user_rating.aggregate_rating),
          restaurant.user_rating.rating_text,
          restaurant.user_rating.rating_color,
          parseInt(restaurant.user_rating.votes),
          restaurant.has_online_delivery ? 1 : 0,
          restaurant.location.address,
          restaurant.location.city,
          parseFloat(restaurant.location.latitude),
          parseFloat(restaurant.location.longitude),
          restaurant.featured_image
        ];

        connection.query(insertQuery, values, (err, results, fields) => {
          if (err) {
            console.error(`Error inserting restaurant with id ${restaurant.R.res_id}:`, err.message);
          } else {
            console.log(`Inserted restaurant with id ${restaurant.R.res_id}`);
          }
        });
      } else {
        console.error('Invalid restaurant data:', item);
      }
    });
  });

  connection.end();
});
