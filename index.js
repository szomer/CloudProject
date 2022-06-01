// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const store = require('better-express-store');
const passwordEncryptor = require('./passwordEncryptor');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";


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
    console.log('data');
    // Perform db query
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    delete result.password;
    const results = { 'results': (result) ? result.rows : null };

    console.log('DATA::::' + results);
    res.send(results).end();

  } catch (err) {
    res.status(404).json({
      message: 'Problem with requesting data'
    }).end();
  }
});

app.get('/jwt', (req, res) => {
  let token = jwt.sign({ "body": "randomdata" }, JWT_SECRET, { algorithm: 'HS256' });
  res.send(token).end();
})

// Check if user logged in
app.get('/api/login', authenticateToken, async (req, res) => {
  console.log('check log in');
  res.status(200).json({
    message: 'Logged In'
  }).end();
});

// Log in user
app.post('/api/login', urlencodedParser, async (req, res) => {
  // Encrypt the password
  req.body[passwordField] = passwordEncryptor(req.body[passwordField]);

  // Construct db query
  const client = await pool.connect();
  const query = {
    name: 'fetch-user',
    text: 'SELECT * FROM users WHERE email =$1 AND password = $2',
    values: [req.body[emailField], req.body[passwordField]],
  }

  // Perform db query
  client.query(query, (err, response) => {
    try {
      console.log('login');
      console.log("RESULTCOUNT::::" + response.rows.length);

      // Match found
      if (response.rows.length > 0) {
        let result = response.rows[0];
        delete result.password;
        req.session.user = result;

        let email = req.body[emailField];
        let token = jwt.sign({ "body": email }, JWT_SECRET, { algorithm: 'HS256' });

        let obj = { "jwt": token }
        console.log("obj: " + JSON.stringify(obj));

        res.json(obj).end();

        // res.json(result);
      }
    } catch (err) {
      res.status(404).json({
        message: 'User does not exist'
      }).end();
    }
  });
});

// Register new user
app.post('/api/register', urlencodedParser, async (req, res) => {
  // Encrypt the password
  req.body[passwordField] = passwordEncryptor(req.body[passwordField]);

  // Combine first and last name
  let fullName = (req.body[firstNameField] + ' ' + req.body[lastNameField]);

  try {
    console.log('register');
    // Peform query db
    const client = await pool.connect();
    const result = await client.query("INSERT INTO users (name, email, type, password) VALUES ('" + fullName + "', '" + req.body[emailField] + "', 'customer', '" + req.body[passwordField] + "')");

    // Delete password from result
    delete req.body[passwordField];
    res.json(req.body).end();

  } catch (err) {
    res.status(404).json({
      message: 'Problem with registering account'
    }).end();
  }
});

function authenticateToken(req, res, next) {
  const token = req.header('auth-token');
  console.log(token);

  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token').end;
  }
}


// heroku pg:psql
//  create table users (id SERIAL, name varchar(30), email varchar(30), type varchar(30), password varchar(255));
// insert into users (name, email, type, password) values ('Suzanne Zomer', 'myemail@gmail.com', 'customer', '12345678');