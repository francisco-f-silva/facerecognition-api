const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('this is working');
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