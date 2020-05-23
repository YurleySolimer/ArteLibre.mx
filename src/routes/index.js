const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isCliente} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');
const { isArtista} = require('../lib/auth');

var artista = false;
var cliente = false;
var nombre = {
  nombre : '',
  apellido : '',
};
var logueado = false;

async function isArtist (req) {
  if (req.user) { 
    var usuario = await pool.query('SELECT tipo FROM users WHERE id =?', [req.user.id]);
    nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    if (usuario[0].tipo == 'Artista') {
      logueado = true;
      return true;
    }
    return false;
    }
    logueado = false;

  return false;
};

async function isClient (req) {
  if (req.user) { 
    var usuario = await pool.query('SELECT tipo FROM users WHERE id =?', [req.user.id]);
    nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    if (usuario[0].tipo == 'Cliente') {
      logueado = true;
      return true;
    }
    return false;
  }
  logueado = false;

  return false;
};


router.get('/', async (req, res) => {
	artista = await isArtist(req);
	cliente = await isClient(req);
	res.render('index', {artista, cliente, logueado, nombre:nombre[0]});
});



module.exports = router;