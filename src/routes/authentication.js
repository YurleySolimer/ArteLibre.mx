const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/registro-artista', isNotLoggedIn, (req, res) => {
	res.render('auth/registroArtista');
  });

  router.get('/registro-cliente', isNotLoggedIn, (req, res) => {
	res.render('auth/registroCliente');
  });

router.post('/registro-artista', isNotLoggedIn, passport.authenticate('user.signup', {
  	successRedirect: '/perfil',
  	failureRedirect: '/registro-artista',
  	failureFlash: true
}));

router.post('/registro-cliente', isNotLoggedIn, passport.authenticate('user.signup', {
	successRedirect: '/obras',
	failureRedirect: '/registro-cliente',
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