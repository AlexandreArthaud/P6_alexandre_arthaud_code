const http = require('http');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config();

const normalizePort = val => {
	// port validation function
	// return a valid port, be it as a string or a number
	const port = parseInt(val, 10);
	
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}

	return false
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
	// error handling function
	if (error.syscall != 'listen') {
		throw error;
	}

	const address = server.address();
	const bind = typeof adress === 'string' ? 'pipe' + address : 'port: ' + port;
	
	switch (error.code) {
		case 'EACESS':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};


const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe' + address : 'port ' + port;
	console.log('Listening on ' + bind); // use console.log() for debugging into Node console
});

server.listen(port);


