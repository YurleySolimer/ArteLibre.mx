const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

  router.get('/registro-cliente', (req, res) => {
	res.render('auth/registroCliente');
  });

  router.post('/registro-cliente', passport.authenticate('signupCliente', {
	successRedirect: '/obras',
	failureRedirect: '/registro-cliente',
	failureFlash: true
}));

router.get('/registro-artista', (req, res) => {
	res.render('auth/registroArtista');
  });


router.post('/registro-artista', passport.authenticate('signupArtista', {
	successRedirect: '/artistas',
	failureRedirect: '/registro-artista',
	failureFlash: true
}
));

router.get('/iniciar-sesion',  isNotLoggedIn, (req, res) => {
	res.render('auth/signin');
  });

router.post('/iniciar-sesion', isNotLoggedIn, (req, res, next) => {
	passport.authenticate('local.signin', {
		successRedirect: '/obras',
		failureRedirect: '/signin',
		failureFlash: true
	})(req, res, next);
});


router.get('/logout', isLoggedIn, (req,res) => {
	req.logOut();
	res.redirect('/signin');
});

module.exports = router;