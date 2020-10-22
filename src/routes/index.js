const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isCliente} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');
const { isArtista} = require('../lib/auth');

var artista = false;
var cliente = false;
var admin = false;
var nombre = {
  nombre : '',
  apellido : '',
};
var logueado = false;
const Handlebars = require('handlebars');

Handlebars.registerHelper('fecha', function(date) {
  const dia = date.getDate();
  const mes = date.getMonth()+1;
  const año = date.getFullYear();	  
  return `${dia} - ${mes} - ${año}`;
});

async function isArtist (req) {
  if (req.isAuthenticated()) { 
    var usuario = await pool.query('SELECT tipo FROM users WHERE id =?', [req.user.id]);

    if (usuario[0].tipo == 'Artista') {
      logueado = true;
      return true;
    }
    return false;
    }
  else { 
    logueado = false;
    return false;
  }
};

async function isClient (req) {
  if (req.isAuthenticated()) { 
    var usuario = await pool.query('SELECT tipo FROM users WHERE id =?', [req.user.id]);

    if (usuario[0].tipo == 'Cliente') {
      logueado = true;
      return true;
    }
    return false;
  }
  else {
  logueado = false;
   return false;
  }
};

async function isAdmin (req) {
  if (req.isAuthenticated()) { 
    var usuario = await pool.query('SELECT tipo FROM users WHERE id =?', [req.user.id]);

    if (usuario[0].tipo == 'Admin') {
      logueado = true;
      return true;
    }
    return false;
  }
  else { 
  logueado = false;
  return false;
  }
};

router.get('/', async (req, res) => {
	artista = await isArtist(req);
  cliente = await isClient(req);
  admin = await isAdmin(req);

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  }

  var obra_destacada = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND recomendar =? LIMIT 1', ['True', 'Si']);
  var destacadas = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND destacar =? ORDER BY id DESC LIMIT 8', ['True', 'Si']);

  var artista_destacado = await pool.query('SELECT * FROM usuarioArtista WHERE destacar =? LIMIT 1', ['Si']);
  if (artista_destacado.length>0) { 
    var id_artista = artista_destacado[0].id;
    var obra1_artista = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id ASC LIMIT 1', ['True', id_artista]);
    var obra2_artista = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id DESC LIMIT 1', ['True', id_artista]);
  }

  const eventos = await pool.query('SELECT * FROM eventoCompleto LIMIT 8');  
  const coleccion_destacada = await pool.query('SELECT * FROM coleccionArtista WHERE destacar =? LIMIT 1', ['Si']);
  var obras_coleccion = [];
  if (coleccion_destacada.length > 0) {
    obras_coleccion = await pool.query('SELECT * FROM obraCompleta WHERE coleccion_id =?', [coleccion_destacada[0].id]);
  }

	res.render('index', {artista, admin, nombre:nombre[0], cliente, logueado, eventos, coleccion_destacada:coleccion_destacada[0], obras_coleccion, obra_destacada, destacadas, obra1_artista, obra2_artista,  artista_destacado});
});


module.exports = router;