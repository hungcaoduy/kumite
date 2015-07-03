var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// passport config
var User = require('./models/user'),
    LocalUser = User.LocalUser,
    FacebookUser = User.FacebookUser;

passport.use(new LocalStrategy(LocalUser.authenticate()));
// passport.serializeUser(LocalUser.serializeUser());
// passport.deserializeUser(LocalUser.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    FacebookUser.findById(id,function(err,user){
        if (err) done(err);
        if (user) {
            done(null,user);
        } else {
            LocalUser.findById(id, function(err,user){
                if(err) done(err);
                done(null,user);
            });
        }
    });
});

passport.use(new FacebookStrategy({
  clientID: '855883031133476',
  clientSecret: '563e53d37cc3f2255edcf3719cafd85e',
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
function(accessToken, refreshToken, profile, done) {
  FacebookUser.findOne({fbId: profile.id}, function(err, oldUser) {
    if (oldUser) {
      done(null, oldUser);
    } else {
      var newUser = new FacebookUser({
        fbId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      }).save(function(err, newUser) {
        if (err) throw err;
        done(null, newUser);
      });
    }
  });
}
));


mongoose.connect('mongodb://localhost/kumite');


app.use('/', routes);
// app.use('/users', users);


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
