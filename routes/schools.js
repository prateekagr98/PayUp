var express = require('express');
var router = express.Router();
var SchoolModel = require('../models/SchoolModel');

/* GET home page. */
router.get('/new', function(req, res) {
  res.render('addSchool', { title: 'PayUp' });
});

router.post('/save', function(req, res) {
	var email = req.body.email,
		password = req.body.password,
		name = req.body.name;

	if(email && password && name){
		var newSchool = new SchoolModel({
			name: req.body.name,
			address: req.body.address,
			email: req.body.email,
			password: req.body.password,
			conatctNo: req.body.contactNo
		});

		newSchool.save(function(err, newSchool) {
			if(err) {
				return console.error(err);
			}
			console.log('New School Added');
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify(newSchool));
		});
	}
	else{
		res.redirect('/schools/new');
	}
});

module.exports = router;
