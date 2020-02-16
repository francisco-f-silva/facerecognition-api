 const getProfile = (req, res, db) => {
	const { id } = req.params;
	// SELECT * FROM users WHERE id = ...;
	db.select('*').from('users').where({ id: id })
		.then(user => {
			if (user.length) {
				return res.json(user[0]);
			} else {
				return res.status(404).json('not found');
			}
		})
		.catch(res.status(400).json('unable to work with database'))
	;
};

module.exports = {
	getProfile: getProfile
};