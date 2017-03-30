var mongoose = require('mongoose');
var fs = require('fs');

module.exports = function(app) {

	var api = {};

	var model = mongoose.model('Tests');

	api.list = function(req, res) {

		model.find({userId : req.params.id})
		.then(function(tests) {
			res.json(tests);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	api.findOne = function(req, res) {

		model.findOne({"votes.userVotingId" : { $nin : [req.params.id] } })
		.then(function(tests) {
			res.json(tests);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	api.findById = function(req, res) {
		model.findOne({"_id" : req.params.id })
		.then(function(test) {
			
			var total = test.votes.length;
			var info = { test : test, total : total};
			
			var iAtractive = 0;
			var iSmart = 0;
			var iTrustworthy = 0;

			for (var i = 0; i < total; i++)
			{
				iAtractive += test.votes[i].atractive;
				iSmart += test.votes[i].smart;
				iTrustworthy += test.votes[i].trustworthy;

			}

			info.atractive = (iAtractive / total);
			info.smart = (iSmart / total);
			info.trustworthy = (iTrustworthy / total);
			
			res.json(info);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});
	}

	api.removeById = function(req, res) {

		model.remove({'_id' : req.params.id})
		.then(function() {
			res.end(); 
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	api.addVote = function(req, res) {

		model.findByIdAndUpdate(req.params.id, { $push : { votes : req.body } })
			.then(function(song) {
				res.end(); 
			}, function(error) {
				console.log(error);
				res.sendStatus(500);
			});

	};

	api.add = function(req, res) {
		
		var arquivo = "img-" + (new Date().getTime()) + ".png";
		var category = req.headers.category;
		var userId = req.headers.userid;

		var obj = {
			file : arquivo,
			userId : userId,
			category : category
		}

		req.pipe(fs.createWriteStream("files/" + arquivo))
		.on('finish', function(){
			
			model.create(obj)
				.then(function() {
					res.end(); 
				}, function(error) {
					res.sendStatus(500);
					console.log(error)
				});

		});
	};	
	
	return api;
};

