const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
const { isCliente} = require('../lib/auth');
const { isArtista} = require('../lib/auth');

var artista = false;
var cliente = false;
var nombre = '';
var logueado = false;

async function isArtist (req) {
  if (req.user.id) { 
    var usuario = await pool.query('SELECT tipo FROM users WHERE id =?', [req.user.id]);
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
  if (req.user.id) { 
    var usuario = await pool.query('SELECT tipo FROM users WHERE id =?', [req.user.id]);
    if (usuario[0].tipo == 'Client') {
      logueado = true;
      return true;
    }
    return false;
  }
  logueado = false;

  return false;
};

async function Nombre (req) {
  if (req.user.id) { 
    var usuario = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
    return usuario;
  }
};

router.get('/coleccion', async  (req, res) => {
  const nombre = await Nombre(req);
  artista = await isArtist(req);
  cliente = await isClient(req);
  res.render('general/coleccion', {artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/registro',  async (req, res) => {
  const nombre = await Nombre(req);
  artista = await isArtist(req);
  cliente = await isClient(req);
  res.render('general/registro' , {artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/colecciones', async (req, res) => {
  const nombre = await Nombre(req);
  artista = await isArtist(req);
  cliente = await isClient(req);
  res.render('general/colecciones' , {artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/obra/:id', async (req, res) => {
  const obra = await pool.query('SELECT * FROM obraCompleta WHERE id =?', [req.params.id]);
  const fotos = await pool.query('SELECT * FROM fotosObras WHERE obra_id=?', [req.params.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  const nombre = await Nombre(req);
  artista = await isArtist(req);
  cliente = await isClient(req);
  var myArray = [];
  for(var i=0;i<3;i++){
    var numeroAleatorio = Math.ceil(Math.random()*obras.length);
    var existe = false;
    for (var j=0; j<myArray.length; j++) {
      if (myArray[j] == obras[numeroAleatorio-1]) {
          existe = true;
      }
    }
    if (existe == false) {
      myArray[i] = obras[numeroAleatorio-1];
    }
  }
  res.render('general/obra', {obra:obra[0], fotos, myArray, artista, cliente, logueado, nombre:nombre[0]});
});


router.get('/artista', async (req, res) => {
  const nombre = await Nombre(req);
  artista = await isArtist(req);
  cliente = await isClient(req);
  res.render('general/artista' , {artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/artistas', async (req, res) => {
  const artistas = await pool.query('SELECT * FROM usuarioArtista');
  const nombre = await Nombre(req);
  artista = await isArtist(req);
  cliente = await isClient(req);
  res.render('general/artistas', {artistas, artista, logueado, nombre:nombre[0]});

});

router.get('/obras',  async (req, res) => {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  const nombre = await Nombre(req);
  artista = await isArtist(req);
  cliente = await isClient(req);
  res.render('general/obras', {obras, artista, cliente, logueado, nombre:nombre[0]});
});



module.exports = router;