var express=require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.isAdmin = (req,res,next)=>{
    if(res.locals.user && res.locals.user.admin ){
        next();
    }
    else{
        res.redirect('/users/login');
    }
}