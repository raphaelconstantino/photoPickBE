module.exports = function(uri) {

	var mongoose = require('mongoose');

	mongoose.connect(uri);

	mongoose.connection.on('connected', function() {
		console.log('Connected to MongoDB')
	});

	mongoose.connection.on('error', function(error) {
		console.log('Error on Connection: ' + error);
	});	

	mongoose.connection.on('disconnected', function() {
		console.log('Disconnected from MongoDB')
	});

	process.on('SIGINT', function() {
		mongoose.connection.close(function() {
			console.log('App terminated, connection closed')
			process.exit(0);
		});
		
	})
};


