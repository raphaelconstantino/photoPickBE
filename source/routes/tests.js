module.exports = function(app) {
	
	var api = app.api.tests;

	app.route('/tests')
		.post(api.add);

	app.route('/tests/findOne/:id')
		.get(api.findOne);

	app.route('/tests/detail/:id')
		.get(api.findById);		

	app.route('/tests/:id')
		.get(api.list)
		.delete(api.removeById)
		.put(api.addVote);
};