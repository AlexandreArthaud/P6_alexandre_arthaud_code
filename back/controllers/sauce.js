const fs = require('fs')
const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res, next) => {
		Sauce.find()
			.then(things => res.status(200).json(things))
			.catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne( { _id: req.params.id })
		.then(thing => res.status(200).json(thing))
		.catch(error => res.status(404).json({ error }));
}

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;

	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});

	sauce.save()
		.then(() => { res.status(201).json({ message: 'Post saved successfully!'}); } )
		.catch((error) => { res.status(400).json({ error }); });
}

exports.modifySauce = (req, res, next) => {
	const thingObject = req.file ?
		{
			...JSON.parse(req.body.sauce),
			imageUrl: `{(req.protocol}://${req.get('host')}/images/${req.file.filename}`
		} : { ...req.body };
	
	if (req.auth.userId != req.params.id) {
		res.status(403);
	}

	Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Object modified' }))
		.catch(error => res.status(400).json({ error }));
}

exports.modifySauceLikes = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }, (err, sauce) => {
		if (req.body.like === 1 && !sauce.usersLiked.includes(req.auth.userId)) { 
			sauce.likes += 1;
			sauce.usersLiked.push(req.auth.userId)

			if (sauce.usersDisliked.includes(req.auth.userId)) {
				sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.auth.userId), 1)
			}
		}
		else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.auth.userId)) {
			sauce.dislikes += 1;
			sauce.usersDisliked.push(req.auth.userId);

			if (sauce.usersLiked.includes(req.auth.userId)) {
				sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.auth.userId), 1);
			}
		}
		else if (req.body.like === 0) {
			if (sauce.usersLiked.includes(req.auth.userId)) {
				sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.auth.userId), 1);
				sauce.likes -= 1;
			}
			if (sauce.usersDisliked.includes(req.auth.userId)) {
				sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.auth.userId), 1)
				sauce.dislikes -= 1;
			}
		}

		sauce.save() 
			.then(() => res.status(200).json({ message: 'Object modified' }))
			.catch(error => res.status(400).json({ error }));
	});
}

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((thing) => {
			if (!thing) {
				res.status(404).json({
					error: new Error('No such Sauce!')
				});
			}
			if (thing.userId !== req.auth.userId) {
				res.status(400).json({
					error: new Error('Unauthorized request!')
				});
			}

			const filename = thing.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Deleted the object' }))
					.catch(error => res.status(400).json({ error }))
			});
		})
		.catch(error => res.status(500).json({ error }));
};
