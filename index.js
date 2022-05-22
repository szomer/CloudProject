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

// Session
app.use(session({
  secret: 'someUnusualStringThatIsUniqueForThisProject',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' },
}));

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

app.get('/', function (req, res) {
  if (session.user) {
    res.redirect('/home');
  }
  res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get('/home', function (req, res) {
  if (req.session.user) {
    res.sendFile(path.join(__dirname + '/frontend/home.html'));
    res.json(req.session.user);
  } else {
    res.sendFile(path.join(__dirname + '/frontend/404noUser.html'));
  }
});

// Log in user
app.post('/api/login', urlencodedParser, async (req, res) => {
  // Encrypt the password
  req.body[passwordField] = passwordEncryptor(req.body[passwordField]);

  const client = await pool.connect();
  client.query(("SELECT * FROM users WHERE email='" + req.body[emailField] + "' AND password='" + req.body[passwordField] + "';"), (err, res) => {
    if (err) throw err;

    for (let row of res.rows) {
      req.session.user = row;
      res.redirect('/home');
      return;
    }

    res.json({ _error: 'User does not exist' });
  });
});

// Check if logged in
app.get('/api/login', (req, res) => {
  res.json(req.session.user || { _error: 'Not logged in' });
});

// Log out user
app.delete('/api/login', (req, res) => {
  delete req.session.user;
  res.json({ success: 'logged out' });
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

    delete req.body[passwordField];

    res.json(req.body);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Return all data from the user table
app.get('/api/data', async (req, res) => {

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');

    delete result.password;

    const results = { 'results': (result) ? result.rows : null };

    res.json(results);

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// heroku pg:psql
//  create table users (id SERIAL, name varchar(30), email varchar(30), type varchar(30), password varchar(255));
// insert into users (name, email, type, password) values ('Suzanne Zomer', 'myemail@gmail.com', 'customer', '12345678');

app.all('*', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname + '/frontend/404.html'));
    res.json(req.session.user);
  } else {
    res.sendFile(path.join(__dirname + '/frontend/404noUser.html'));
  }
});