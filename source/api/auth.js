var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken'); 

module.exports = function(app) {

     var api = {};
     var model = mongoose.model('User');

	api.add = function(req, res) {

		model.create(req.body)
		.then(function(gender) {
			res.end(); 
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});
	};

     api.authenticate = function(req, res) {

         model.findOne({
             login: req.body.login,
             password: req.body.password
         })
         .then(function(user) {
             if (!user) {
                 console.log('Invalid Login/password');
                 res.sendStatus(401);
             } else {
                console.log(user.login)
                 var token = jwt.sign({login: user.login}, app.get('secret'), {
                     expiresIn: 84600
                 });
                 console.log('Authenticated: token add in response');
                 res.set('x-access-token', token); 
                 res.end(); 
             }
         });
     };

    api.verifyToken = function(req, res, next) {

         var token = req.headers['x-access-token'];

         if (token) {
             console.log('Token received, decoded');
             jwt.verify(token, app.get('secret'), function(err, decoded) {
                 if (err) {
                     console.log('Token rejected');
                     return res.sendStatus(401);
                 } else {
                     console.log('Token accepted')
                     req.user = decoded;    
                     next();
                  }
            });
        } else {
            console.log('None token sent');
            return res.sendStatus(401);
          }
    }

    return api;
};