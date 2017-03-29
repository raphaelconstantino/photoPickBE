var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//app.set('secret', 'homemavestruz'); 
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

consign({cwd: 'source'})
    .include('models')
    .then('api')
    .then('routes')
    .into(app);

module.exports = app;


// Add headers
/*app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});*/