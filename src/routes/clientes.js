const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isCliente} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');

var cliente = false;
var logueado = false;

const Handlebars = require('handlebars');


Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if(v1 === v2) {
	  return options.fn(this);
	}
	return options.inverse(this);
  });


router.get('/cliente/compras', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  cliente = true;
  logueado = true;
  res.render('client/compras', {nombre:nombre[0], cliente, logueado});
});

router.get('/cliente/perfil', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  cliente: true;
  logueado: true;
  res.render('client/perfil', {nombre:nombre[0], cliente, logueado});
});

router.get('/cliente/historial', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  cliente = true;
  logueado = true;
  res.render('client/mis-pedidos', {nombre:nombre[0], cliente, logueado});
});


module.exports = router;