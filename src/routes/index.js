const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isCliente} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');
const { isArtista} = require('../lib/auth');

const Handlebars = require('handlebars');
Handlebars.registerHelper('par', function (v1, options) {
  if ((v1%2) == 0) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('impar', function (v1, options) {
  if ((v1%2) != 0) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('fecha', function(date) {
  const dia = date.getDate();
  const mes = date.getMonth()+1;
  const año = date.getFullYear();	  
  return `${dia} - ${mes} - ${año}`;
});

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
  var obra_destacada = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND destacar =? LIMIT 1', ['True', 'Si']);
  var destacadas = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND destacar =? ORDER BY id DESC', ['True', 'Si']);
  var artista_destacado = await pool.query('SELECT * FROM usuarioArtista WHERE destacar =? LIMIT 1', ['Si']);
  var id_artista = artista_destacado[0].id;
  var obra1_artista = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id ASC LIMIT 1', ['True', id_artista]);
  var obra2_artista = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id DESC LIMIT 1', ['True', id_artista]);
  const eventos = await pool.query('SELECT * FROM eventoCompleto');


	res.render('index', {artista, cliente, logueado, nombre:nombre[0], eventos, obra_destacada:obra_destacada[0], destacadas, obra1_artista:obra1_artista[0], obra2_artista:obra2_artista[0],  artista_destacado:artista_destacado[0]});
});


module.exports = router;