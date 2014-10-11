var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('addSchool', { title: 'PayUp' });
});

module.exports = router;
