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

schoolSchema.methods.validPassword = function(password) {
	if(this.password == password) {
		return true;
	}
	else {
		return false;
	}
}

var SchoolModel = mongoose.model('School', schoolSchema);

module.exports = SchoolModel;