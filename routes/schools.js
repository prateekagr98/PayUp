var express = require('express');
var router = express.Router();
var SchoolModel = require('../models/SchoolModel');
var passport = require('passport');

/* GET home page. */
router.get('/new', function(req, res) {
  res.render('addSchool', { title: 'PayUp' });
});


/* Save School Data */
router.post('/save', function(req, res) {
	var email = req.body.email,
		password = req.body.password,
		name = req.body.name;

	console.log(req.body);

	if(email && password && name){
		var newSchool = new SchoolModel({
			name: req.body.name,
			address: req.body.address,
			email: req.body.email,
			password: req.body.password,
			contactNo: req.body.contactNo,
			city: req.body.city,
			state: req.body.state
		});

		newSchool.save(function(err, newSchool) {
			if(err) {
				console.log('not saved');
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


router.post('/login', passport.authenticate('local', { successRedirect: '/schools/new',
                                   failureRedirect: '/',
                                   failureFlash: false })
);


module.exports = router;
