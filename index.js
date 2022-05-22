// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const store = require('better-express-store');
const passwordEncryptor = require('./passwordEncryptor');

// HTML fields for user input
const passwordField = 'password';
const emailField = 'email';
const firstNameField = 'firstName';
const lastNameField = 'lastName';


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

// Create application/json parser
var jsonParser = bodyParser.json()
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Listen on port
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});


// Return all data from the user table
app.get('/api/data', async (req, res) => {

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');

    console.log(result.rows);

    const results = { 'results': (result) ? result.rows : null };

    console.log(results);
    console.log(JSON.stringify(results));

    res.json(results);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Log in user
app.post('/api/login', urlencodedParser, async (req, res) => {
  // Encrypt the password
  req.body[passwordField] = passwordEncryptor(req.body[passwordField]);

  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE email='" + req.body[emailField] + "' AND password='" + req.body[passwordField] + "'");

    console.log(result.rows);

    const results = { 'results': (result) ? result.rows : null };

    console.log(results);
    console.log(JSON.stringify(results));

    res.json(results);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Register new user
app.post('/api/register', urlencodedParser, async (req, res) => {
  // Encrypt the password
  req.body[passwordField] = passwordEncryptor(req.body[passwordField]);

  // Combine first and last name
  let fullName = (req.body[firstNameField] + ' ' + req.body[lastNameField]);

  try {
    const client = await pool.connect();
    const result = await client.query("INSERT INTO users (name, email, type, password) VALUES ('" + fullName + "', '" + req.body[emailField] + "', 'customer', '" + req.body[passwordField] + "')");

    console.log(result.rows);

    const results = { 'results': (result) ? result.rows : null };

    console.log(results);
    console.log(JSON.stringify(results));

    res.json(results);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});



// heroku pg:psql
//  create table users (id SERIAL, name varchar(30), email varchar(30), type varchar(30), password varchar(255));
// insert into users (name, email, type, password) values ('Suzanne Zomer', 'myemail@gmail.com', 'customer', '12345678');