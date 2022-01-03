const express = require('express');
const mongoose = require('mongoose');

const app = express();

// const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

mongoose.connect(
	'mongodb+srv://alyeksandre:duahtra42;@cluster0.vlv5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	{ useNewUrlParser: true,
		useUnifiedTopology: true,
	}
)
.then(() => console.log("Connected to MongoDB"))
.catch(() => console.log("Not connected to MongoDB"));

app.use((req, res, next) => {
	// allow CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(express.json());
// app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

