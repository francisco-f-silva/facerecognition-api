const express = require('express');

const app = express(); //creates server

app.use(express.json()); //parses body of request into json (otherwise when trying to read body we'll get an error)

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	]
};

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
	const signin = database.users.some(user => {
		return req.body.email === user.email 
			&& req.body.password === user.password;
	});
	if (signin) {
		res.json('success signing in, wohooo');
	} else {
		res.status(400).json('error! credentials are not valid!');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(404).json('not found');
	}
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(404).json('not found');
	}
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