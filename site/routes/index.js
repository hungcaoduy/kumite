var express = require('express');
var passport = require('passport');
var LocalUser = require('../models/user').LocalUser;
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    LocalUser.register(new LocalUser({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', {info: 'Sorry. That username already exists. Try again.'});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook',{ scope : 'email'}));
router.get('/auth/facebook/callback', 
    passport.authenticate('facebook',{ failureRedirect: '/login'}),
    function(req,res){
        res.render('profile', {user : req.user});
    }
);


module.exports = router;