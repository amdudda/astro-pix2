var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session');
//var MongoDBStore = require('connect-mongodb-session')(session);

/*New things to require */
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
/* End of new things to require */

var routes = require('./routes/index');
var favorites = require('./routes/favorites');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));


/* Add this for passport */
app.use(session({
    secret: 'ef489e121cb4238c0f58e290c70c97c4'  // found an online hash generator, hashed a phrase, and picked one of the shorter options offered.
}));

require('./config/passport')(passport);
// passport.js module.export exports a function
// that expects a passport object as an argument.
// This require statement calls that function with the passport
// object you required on line 10.

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//DB
var url = 'mongodb://localhost:27017/astropix_users';
mongoose.connect(url);
//TODO error handler

/*End of stuff to add. Rest of app.js follows... */

// TODO this can be deleted once we have user object working
//mongodb stuff
//Configure our database to store sessions persistently.
/*var store = new MongoDBStore(
    {
      uri:'mongodb://localhost:27017/astropix_sessions',
      collection: 'favorite_pictures',
    }
);

//Configure our application to use sessions
//And to save them in the store we just configured.
app.use(session({
  secret: "lalaland45641635",
  store: store,
  resave: false,
  saveUninitialized: false
}));
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/favorites', favorites);

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
