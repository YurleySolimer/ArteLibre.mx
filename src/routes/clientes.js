const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isCliente} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');

var cliente = false;
var logueado = false;

const Handlebars = require('handlebars');

Handlebars.registerHelper('año', function(date) {
  const año = date.getFullYear();  
  return año;
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if(v1 === v2) {
	  return options.fn(this);
	}
	return options.inverse(this);
  });


router.get('/compras', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  cliente = true;
  logueado = true;
  res.render('client/compras', {nombre:nombre[0], cliente, logueado});
});

router.get('/mis-pedidos', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  cliente = true;
  logueado = true;
  res.render('client/mis-pedidos', {nombre:nombre[0], cliente, logueado});
});


module.exports = router;