const express = require('express');
const cors = require('cors'); //allows connection with frontend (security reasons)
const knex = require('knex'); //SQL query builder (for connection with database)
const bcrypt = require('bcrypt-nodejs'); //to encrypt the password

const signin = require('./controllers/signin.js');
const register = require('./controllers/register.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'francisco',
    password : 'qwerty',
    database : 'smart-brain'
  }
});

const app = express(); //creates server

app.use(express.json()); //parses body of request into json (otherwise when trying to read body we'll get an error)
app.use(cors()); //allows connection between frontend and backend

app.get('/', (req, res) => res.send("this is working"));
app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.getProfile(req, res, db));
app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

app.listen(3000, () => {
	console.log('app is running on port 3000');
});

/*
/ --> res = this is working (root route)
/signin --> POST = success/fail (it's a POST request in order to send the password safely in the body
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user (updates the number of images sent and the rank of that user)
*/