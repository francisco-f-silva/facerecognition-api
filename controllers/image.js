const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '39c7f5269c8f40d38ab3a96dc546d3a7'
});

const handleApiCall = (req, res) => {
	app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => res.json(data))
      .catch(err => res.status(400).json('unable to work with API'))
	;
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	// UPDATE users SET entries = entries + 1 WHERE id = ...;
	db('users')
		.where({id}) //same as .where({ id: id }) or as .where('id', '=', 'id')
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			if (entries.length) {
				return res.json(entries[0]);
			} else {
				return res.status(404).json('not found');
			}
		})
		.catch(err => res.status(400).json('unable to work with database'))
	;
};

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
};