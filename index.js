//------INSTALLATIONS------
//npm init --yes
//npm install express
//npm install pg
//npm install -g heroku


const express = require('express');
const path = require('path');

// DB connection
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initiate app
const app = express();

// Set port
const port = process.env.PORT || 3000;

// Provide website documents
app.use(express.static(path.join(__dirname, 'frontend')));


// Express middleware to read request body
app.use(express.json({ limit: '100MB' }));


// Listen on port
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});


app.get('/', (req, res) => {
  console.log("welcome");

}).get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const results = { 'results': (result) ? result.rows : null };

    console.log(results);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})


// Import the rest-api setup function
// const setupRESTapi = require('./rest-api');
// setupRESTapi(app, pool);





// heroku pg:psql
//  create table users (id SERIAL, name varchar(30), email varchar(30), type varchar(30), password varchar(255));
// insert into users (name, email, type, password) values ('Suzanne Zomer', 'myemail@gmail.com', 'customer', '12345678');