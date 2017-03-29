var http = require('http');
var app = require('./config/express');
require('./config/database')('mongodb://localhost/photoPick');
//require('./config/database')(process.env.MONGODB_URI);

http.createServer(app)
.listen(process.env.PORT || 8080, function() {
	console.log('Server Started');
});
