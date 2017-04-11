var mongoose = require('mongoose');
const formidable = require('formidable');
var jwt  = require('jsonwebtoken'); 
const path = require('path')
const uploadDir = path.join(__dirname, '/..', '/..', '/files/') 

module.exports = function(app) {

	var api = {};

	var model = mongoose.model('Tests');

	api.list = function(req, res) {
		var userId = jwt.decode(req.headers["x-access-token"]).userId;

		model.find({userId : userId})
		.then(function(tests) {
			res.json(tests);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	api.findOneToVote = function(req, res) {
		// Também validar o karma do user para saber
		// se ele já votou o suficiente para ser votado
		// Irá fazer um join com tabela de usuario???
		var userId = jwt.decode(req.headers["x-access-token"]).userId;

		model.findOne({
			"votes.userVotingId" : { $nin : [userId] } ,
			"userId" : { $ne: userId }
		})
		.then(function(tests) {
			res.json(tests);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	api.findById = function(req, res) {
		// Abrir token e tentar pegar _id do User 
		// para mandar junto no fetch e só retornar tests relacionados
		// ao user logado
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

	// Request:
	// Header: Id na url do put
	// Body: {"userVotingId":"58dae4965218d52decbff84a", "comment":"I would Date!", "atractive" : "3", "smart" : "3", "trustworthy" : "3" }
	api.addVote = function(req, res) {
		// Adicionar +1pto para usuario que está votando (_id deste user está no body do request)
		// E remover -1pto para usuario que está recebendo voto ( _id deste user está no response da operação)

		var idUserVoting = jwt.decode(req.headers["x-access-token"]).userId;
		
		var vote = req.body;
		vote["userVotingId"] = idUserVoting;

		model.findByIdAndUpdate(req.params.id, { $push : { votes : req.body } })
			.then(function(test) {
				// Add +1 point to user voting
				// Remove -3 points to user being voted
				app.api.auth.addAndRemovePoints(test.userId, idUserVoting, res);

				res.json(info);
			}, function(error) {
				console.log(error);
				res.sendStatus(500);
			});

	};

	api.add = function (req, res, next) { 
		var form = new formidable.IncomingForm();
		form.multiples = true;
		form.keepExtensions = true;
		form.uploadDir = uploadDir;
		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log(err)
				return res.status(500).json({ error: err })
			}	
			
		})
		form.on('fileBegin', function (name, file) {
			const [fileName, fileExt] = file.name.split('.');
			var ext = `${fileName}_${new Date().getTime()}.${fileExt}`;
			var sName = path.join(uploadDir, `${ext}`);
			file.path = sName;

			// Insert findById
			var category = req.headers.category;
			var userId = jwt.decode(req.headers["x-access-token"]).userId;

			var obj = {
				file : ext,
				userId : userId,
				category : category
			}

			model.create(obj).then(function() {});			
		})
		form.on('end', function (file) {
			res.status(200).json({});
		})
	}
	
	api.getImage = function (req, res) {
		res.sendFile(path.join(uploadDir, `${req.params.file}`));
	}

	return api;
};

