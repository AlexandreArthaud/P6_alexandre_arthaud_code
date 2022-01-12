const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');

const passwordValidator = [
	validate({
		validator: 'isLength',
		arguments: [3, 40],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
	}),
]

const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, validate: passwordValidator }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
