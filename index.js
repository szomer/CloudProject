//------INSTALLATIONS------
//npm init --yes
//npm install express
//npm install pg
//npm install -g heroku

const express = require('express');
const path = require('path');
const session = require('express-session');
const store = require('better-express-store');
const acl = require('./acl');
const passwordEncryptor = require('./passwordEncryptor');

const passwordField = 'password';


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

app.set('view engine', 'ejs');


// Express middleware to read request body
app.use(express.json({ limit: '100MB' }));


// Listen on port
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const results = { 'results': (result) ? result.rows : null };

    console.log(results);

    response.writeHead(200, { "Content-Type": "text/plain" });
    res.send(results);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/api/login', (req, res) => {
  // Encrypt the password
  req.body[passwordField] = passwordEncryptor(req.body[passwordField]);

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = :email AND password = :password');
    const results = { 'results': (result) ? result.rows : null };

    res.send(results);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


// Import the rest-api setup function
// const setupRESTapi = require('./rest-api');
// setupRESTapi(app, pool);





// heroku pg:psql
//  create table users (id SERIAL, name varchar(30), email varchar(30), type varchar(30), password varchar(255));
// insert into users (name, email, type, password) values ('Suzanne Zomer', 'myemail@gmail.com', 'customer', '12345678');