const fs = require('fs');
const sauce = require('../models/sauce');
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
	// User liked
	if (req.body.like === 1) {
		Sauce.updateOne({ _id: req.params.id },
			{ 
				$inc: { likes: 1 },
				$pull: { usersDisliked: req.auth.userId },
				$push: { usersLiked: req.auth.userId }
			})
		.then(() => res.status(200).json({ message: "Object modified"}))
		.catch(error => res.status(400).json({ error }));
	}
	// User disliked
	else if (req.body.like === -1) {
		Sauce.updateOne({ _id: req.params.id },
			{ 
				$inc: { dislikes: 1 },
				$pull: { usersLiked: req.auth.userId },
				$push: { usersDisliked: req.auth.userId }
			})
		.then(() => res.status(200).json({ message: "Object modified"}))
		.catch(error => res.status(400).json({ error }));
	}
	// User cancelled
	else if (req.body.like === 0) {
		Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			let update = {};
			if (sauce.usersLiked.includes(req.auth.userId)) {
				update = {
					$inc: {
						likes: -1
					},
					$pull: {
						usersLiked: req.auth.userId ,
						usersDisliked: req.auth.userId 
					}
				}
			}
			else if (sauce.usersDisliked.includes(req.auth.userId)) {
				update = {
					$inc: {
						dislikes: -1
					},
					$pull: {
						usersLiked: req.auth.userId ,
						usersDisliked: req.auth.userId 
					}
				}
			}

			Sauce.updateOne({ _id: req.params.id }, update)
			.then(() => res.status(200).json({ message: "Object modified"}))
			.catch(error => res.status(400).json({ message: error }));
		})
	}
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
