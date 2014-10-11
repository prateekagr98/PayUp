var mongoose = require('mongoose');

var schoolSchema = mongoose.Schema({
	name: String,
	email: String,
	contactNo: String,
	location: String,
	city: String,
	state: String,
	password: String,
});

var SchoolModel = mongoose.model('School', schoolSchema);

module.exports = SchoolModel;