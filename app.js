var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require ('http');             // For serving a basic web page.
var mongoose = require ("mongoose"); // For mongoose.
var passport = require('passport');  // For passport 
var LocalStrategy = require('passport-local').Strategy;  // For passport-local
var SchoolModel = require('./models/SchoolModel');
var fs = require('fs');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost:27017/barone';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

passport.serializeUser(function(school, done) {
  done(null, school.id);
});

passport.deserializeUser(function(id, done) {
  SchoolModel.findById(id, function(err, school) {
    done(err, school);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    SchoolModel.findOne({ email: username }, function (err, school) {
      if (err) { return done(err); }
      if (!school) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!school.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, school);
    });
  }
));

var routes = require('./routes/index');
var users = require('./routes/users');
var schools = require('./routes/schools');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/schools', schools);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
