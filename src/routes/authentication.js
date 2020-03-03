const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {  //ruta de SignUp
  res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  	successRedirect: '/locales',
  	failureRedirect: '/signup',
  	failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {  //ruta de SignIn
  res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
	passport.authenticate('local.signin', {
		successRedirect: '/dashboard',
		failureRedirect: '/signin',
		failureFlash: true
	})(req, res, next);
});


router.get('/logout', isLoggedIn, (req,res) => {
	req.logOut();
	res.redirect('/signin');
});

module.exports = router;