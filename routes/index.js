var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var config = {};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
 
/*
 * SDK configuration
 */
 
module.exports.init = function(c){
  config = c;
  paypal.configure(c.api);
}

router.get('/create', function(req, res){
	console.log('reached');
  var payment = {
	  "intent": "sale",
	  "payer": {
	    "payment_method": "paypal"
	  },
	  "redirect_urls": {
	    "return_url": "http://localhost:3000/execute",
	    "cancel_url": "http://localhost:3000/cancel"
	  },
	  "transactions": [{
	    "amount": {
	      "total": "5.00",
	      "currency": "USD"
	    },
	    "description": "My awesome payment"
	  }]
	};

	paypal.payment.create(payment, function (error, payment) {
	  if (error) {
	    console.log(error);
	  } else {
	  	console.log('create payment');
	    if(payment.payer.payment_method === 'paypal') {
	      //req.session.paymentId = 4;
	      var redirectUrl;
	      for(var i=0; i < payment.links.length; i++) {
	        var link = payment.links[i];
	        if (link.method === 'REDIRECT') {
	          redirectUrl = link.href;
	        }
	      }
	      res.redirect(redirectUrl);
	    }
	  }
	});
});

router.get('/execute', function(req, res){
  var paymentId = '4';
  var payerId = req.param('PayerID');
 
  var details = { "payer_id": payerId };
  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
    } else {
      res.send("Hell yeah!");
    }
  });
});

router.get('/cancel', function(req, res){
  res.send("The payment got canceled");
});

module.exports = router;
