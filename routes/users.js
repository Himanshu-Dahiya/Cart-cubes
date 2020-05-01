var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

router.get('/register', function (req, res) {

    res.render('register', {
        title: 'Register'
    });

});


router.post('/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').isEmail();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('password2', 'Passwords do not match!').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            title: 'Register'
        });
    } else {
        User.register(new User({username: username, name:name, email:email, admin:1,cart:[]}), 
    req.body.password, (err, user) => {
    if(err) {
      console.log(err)
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/users/login');
      });
    }

});

   }

});


router.get('/login', function (req, res) {

    res.render('login', {
        title: 'Login'
    });

});

router.post('/login', passport.authenticate('local'), (req, res) => {

    res.redirect('/');

});


router.get('/logout', function (req, res) {

    req.logout();
    res.redirect('/users/login');

});

module.exports=router;
