const handleSignIn = (req, res, db, bcrypt) => {
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
}

module.exports = {
	handleSignIn: handleSignIn
};