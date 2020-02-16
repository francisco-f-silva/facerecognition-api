const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('invalid form data');
	}
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
};

module.exports = {
	handleRegister: handleRegister
};