const handleImage = (req, res, db) => {
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
};

module.exports = {
	handleImage: handleImage
};