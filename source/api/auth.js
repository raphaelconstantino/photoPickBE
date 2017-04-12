var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken'); 

module.exports = function(app) {

     var api = {};
     var model = mongoose.model('User');

    api.addAndRemovePoints = function(userVoted, userVoting, res) {

        // Add +1 for user voting
        model.findByIdAndUpdate(userVoting, { $inc: { score: +1 } }).then(function(err, res) {});

        // Add +1 for user voting
        model.findByIdAndUpdate(userVoted, { $inc: { score: -3 } }).then(function(err, res) {});


        return;
    }

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
         model.findOne(req.body)
         .then(function(user) {
             if (!user) {
                 console.log('Invalid Login/password');
                 res.sendStatus(401);
             } else {
                console.log(user.login)
                 var token = jwt.sign({login: user.login, userId: user._id}, app.get('secret'), {
                     expiresIn: 84600
                 });

                 var objJson = {
                     'x-access-token' : token,
                     'userId' : user.id
                }
                 res.json(objJson);
                 res.end(); 
             }
         });
     };

    api.verifyToken = function(req, res, next) {

         var token = req.headers['x-access-token'];

         if (token == undefined)
         {
            token = req.query["x-access-token"];
         }

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