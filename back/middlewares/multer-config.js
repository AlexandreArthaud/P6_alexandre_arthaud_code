const multer = require('multer');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};

// the following contains config for multer
const storage = multer.diskStorage({
	// destination indicates where to save files ('images' folder here)
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	// filename formats name under which the file is saved
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	}
});

// now we export using the *storage* config defined above
// only handling image files (.single('image'))
module.exports = multer({storage: storage}).single('image');

