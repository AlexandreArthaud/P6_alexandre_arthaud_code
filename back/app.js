const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const path = require('path');

const app = express();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(
	`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.vlv5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
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

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;

