const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const nodemailer = require('nodemailer');
const crypto = require('crypto');

var email = '';

var transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: "465",
	secure: true, // true for 465, false for other ports
	auth:{
	  type:"login",
	  user:"yurley.solimer2@gmail.com",
	  pass:"Sparkies_7"
  }});

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
	passport.authenticate('signinUser', {
		successRedirect: '/',
		failureRedirect: '/iniciar-sesion',
		failureFlash: true
	})(req, res, next);
});


router.get('/logout', isLoggedIn, (req,res) => {
	req.logOut();
	res.redirect('/iniciar-sesion');
});

router.post('/recuperar-contrasena', async (req,res) => {
	email = req.body.email;
	const usuario = await pool.query('SELECT * FROM users WHERE email =?', [email]);
	if(usuario.length>0) {
		var token = crypto.randomBytes(4).toString('hex');
		var created = new Date();
		var expireDate = new Date();

		expireDate.setMinutes(expireDate.getMinutes() + 60); //Token expira en una hora
		  
		const newToken = {
			email: email,
    		expiration: expireDate,
			token: token,
			createdAt: created,
    		used: 0
		}

		await pool.query('INSERT INTO ResetTokens set?', [newToken]);

		/*var transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: "465",
			secure: true, // true for 465, false for other ports
			auth:{
			  type:"login",
			  user:"yurley.solimer2@gmail.com",
			  pass:"Sparkies_7"
		  }
		  });*/
	  
		  var mailOptions = {
			  from: 'Arte Libre  <noreply@artelibre.mx>', 
			  to: email,
			  subject: 'Arte Libre: Recuperar Contraseña',
			  text: 'Código de validación: '+encodeURIComponent(token)

			  //text: 'Código de validación: '+encodeURIComponent(token)
		};
		   
	  
		  transporter.sendMail(mailOptions, function (error, info) {
			console.log("senMail returned!");
			if (error) {
			  console.log("ERROR!!!!!!", error);
			} else {
			  console.log('Email sent: ' + info.response);
			}
		  });
		  
		  req.flash('success', 'Código enviado Satisfactoriamente');
		  return res.redirect('validacion-de-codigo/?email='+email);

	}
	else {
		req.flash('message', 'No hay ningún usuario asociado a ese correo');
		res.redirect('iniciar-sesion');

	}
});


router.get('/validacion-de-codigo',  isNotLoggedIn, (req, res) => {
	res.render('auth/codigo');
  });

  router.post('/validacion-de-codigo', async (req, res) => {
	const token = req.body.token;
	const allToken = await pool.query('SELECT * FROM ResetTokens WHERE token =?', [token]);
	console.log(allToken.length)
	if (allToken.length>0) {
		var current = new Date();
		var expiration = allToken[0].expiration;
		var creation = allToken[0].createdAt;
	
		if (current.getTime() < expiration.getTime() && expiration.getTime() > creation.getTime()) {
			res.redirect('/cambio-de-contrasena/?param='+email);		
		} else {
			req.flash('message', 'El código ha expirado');
			   res.redirect('/iniciar-sesion');
		}
	}else {
		req.flash('message', 'Código Inválido');
   		res.redirect('/validacion-de-codigo');
	}

});

  router.get('/cambio-de-contrasena',  isNotLoggedIn, (req, res) => {
	res.render('auth/nuevaContra');
  });

  router.post('/cambio-de-contrasena', async (req,res) => {
	await pool.query('DELETE FROM ResetTokens WHERE email =?', [email]);
	const {password} = req.body;
	const passw = {
		password : password
	}
	passw.password = await helpers.encryptPassword(password);
	const act = await pool.query('UPDATE users set ? WHERE email =?', [passw, email]);


	  var mailOptions = {
		  from: 'Arte Libre  <norepply@artelibre.mx>', 
		  to: email,
		  subject: 'Arte Libre: Cambio de Contraseña',
		  text: 'Su contraseña ha sido cambiada exitosamente'

	};
	     
	  transporter.sendMail(mailOptions, function (error, info) {
		console.log("senMail returned!");
		if (error) {
		  console.log("ERROR!!!!!!", error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });
	  
	  req.flash('success', 'Contraseña cambiada Satisfactoriamente' + password);
	  email = '';
	res.redirect('iniciar-sesion');
});

module.exports = router;