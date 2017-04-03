module.exports = function(app) {
	
	var api = app.api.tests;

	app.route('/tests')
		.get(api.list)
		.post(api.add);

	app.route('/tests/findOne')
		.get(api.findOneToVote);

	app.route('/tests/detail/:id')
		.get(api.findById);		

	app.route('/tests/:id')
		.delete(api.removeById)
		.put(api.addVote);
};