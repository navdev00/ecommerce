var express = require('express');
var passport = require('passport');
var bcrypt = require('bcryptjs')
var auth = require('../config/auth');
var guest= auth.guest;

var router = express.Router();

// get user model

var User = require('../models/user');


// get register
router.get('/register',guest, function (req, res) {
    res.render('register', {
        
        title: 'Register'
    })
});

router.post('/register', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;


    req.checkBody('username', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password Do Not Match!').equals(password);

    var errors = req.validationErrors();



    if (errors) {
        res.render('register', {
            errors: errors,
            user:null,
            title: 'Register'
        });

    } else {
        User.findOne({ username: username }, function (err, user) {
            if (err) console.log(err);

            if (user) {
                req.flash('danger', 'User exists , Choose Another!');
                res.redirect('/users/register');

            } else {
                var user = new User({
                    username: username,
                    email: email,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err) console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);

                            } else {
                                req.flash('success', ' You are now registered!');
                                res.redirect('/users/login')
                            }
                        });

                    });
                })

            }

        });
    }


});

//get login

router.get('/login', function (req, res) {
    if (res.locals.user) res.redirect('/');

    res.render('login', {
        title: 'Log In'
    })
});

//POST Login

router.post('/login', function(req,res,next){

    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//GET Logout

router.get('/logout', function(req,res){
    req.logout();

    req.flash('success', 'You are successfully Logged Out!');
    res.redirect('/users/login');
});

module.exports = router;