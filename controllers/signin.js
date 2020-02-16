const handleSignIn = (req, res, db, bcrypt) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('invalid form data');
	}
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(loginData => {
			const isValid = bcrypt.compareSync(password, loginData[0].hash);
			if (isValid) {
				// return user
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(user => res.json(user[0]))
				;
			} else {
				// wrong password
				return res.status(400).json("wrong credentials");
			}
		})
		.catch(err => res.status(400).json("wrong credentials")) //wrong email
	;
}

module.exports = {
	handleSignIn: handleSignIn
};