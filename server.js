const express = require('express');
const cors = require('cors'); //allows connection with frontend (security reasons)
const knex = require('knex'); //SQL query builder (for connection with database)
const bcrypt = require('bcrypt-nodejs'); //to encrypt the password

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

app.get('/', (req, res) => {
	res.send("this is working");
});

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(loginData => {
			const isValid = bcrypt.compareSync(req.body.password, loginData[0].hash);
			if (isValid) {
				// return user
				db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => res.json(user[0]))
				;
			} else {
				// wrong password
				res.status(400).json("wrong credentials");
			}
		})
		.catch(err => res.status(400).json("wrong credentials")) //wrong email
	;
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		// INSERT INTO login (email, hash) VALUES (...);
		trx.insert({
			email: email,
			hash: hash
		})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				// INSERT INTO users (name, email, joined) VALUES (...);
				return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: loginEmail[0],
						joined: new Date()
					})
					.then(user => res.json(user[0]))
				;
			})
			.then(trx.commit)
			.catch(err => {
				trx.rollback;
				res.status(400).json('unable to register');
			})
		;	
	});
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	// SELECT * FROM users WHERE id = ...;
	db.select('*').from('users').where({ id: id })
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(404).json('not found');
			}
		})
	;
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	// UPDATE users SET entries = entries + 1 WHERE id = ...;
	db('users')
		.returning('entries')
		.where({id}) //same as .where({ id: id }) or as .where('id', '=', 'id')
		.update({
			entries: db.raw('entries + 1')
		})
		.then(entries => {
			if (entries.length) {
				res.json(entries[0]);
			} else {
				res.status(404).json('not found');
			}
		})
	;
});

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