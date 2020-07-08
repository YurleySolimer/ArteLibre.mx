const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
const { isCliente} = require('../lib/auth');
const { isArtista} = require('../lib/auth');

var artista = false;
var cliente = false;
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


router.get('/coleccion/:id', async  (req, res) => {
  const id = req.params.id;
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

  var obras = [];
  const colecciones = await pool.query('SELECT * from coleccionArtista WHERE id =?', [id]);
  if (colecciones.length > 0) {
    obras = await pool.query('SELECT * FROM obraCompleta WHERE coleccion_id =?', [id]);
  }

  const obras2 = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);

  var myArray = [];
  for(var i=0;i<3;i++){
    var numeroAleatorio = Math.ceil(Math.random()*obras2.length);
    var existe = false;
    for (var j=0; j<myArray.length; j++) {
      if (myArray[j] == obras[numeroAleatorio-1]) {
          existe = true;
      }
    }
    if (existe == false) {
      myArray[i] = obras2[numeroAleatorio-1];
    }
  }  
  res.render('general/coleccion', {colecciones, obras, myArray, artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/registro',  async (req, res) => {
  artista = await isArtist(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);
  cliente = await isClient(req);
  res.render('general/registro' , {artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/colecciones', async (req, res) => {
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

  const colecciones = await pool.query('SELECT * from coleccionArtista');

  res.render('general/colecciones' , {colecciones, artista,  cliente, logueado, nombre:nombre[0]});
});

router.get('/obra/:id', async (req, res) => {
  const obra = await pool.query('SELECT * FROM obraCompleta WHERE id =?', [req.params.id]);
  const fotos = await pool.query('SELECT * FROM fotosObras WHERE obra_id=?', [req.params.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

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


router.get('/artista/:id', async (req, res) => {
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);
  const user = await pool.query('SELECT * FROM usuarioArtista WHERE id =?', [req.params.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.params.id]);
  var ultima_obra = {
    nombreObra: 'N/A'
  }
  if (obras.length>0) {
    ultima_obra = obras[obras.length-1];
  }

  res.render('general/artista' , {user:user[0], obras, ultima_obra, artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/artista/:id/galeria', async (req, res) => {
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);
  const user = await pool.query('SELECT * FROM usuarioArtista WHERE id =?', [req.params.id]);
  const obras1 = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =? ORDER BY id ASC', [req.params.id]);
  const obras2 = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =? ORDER BY id DESC', [req.params.id]);

  res.render('artist/galeria' , {user:user[0], obras1, obras2, artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/artistas', async (req, res) => {
  var artistas = await pool.query('SELECT * FROM usuarioArtista');
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);
  if(req.query) { 

    if (req.query.tecnicaArtistas || req.query.nombreArtistas) {

      artistas = await pool.query('SELECT * FROM usuarioArtista WHERE nombre =? OR apellido =? OR disciplina_principal =? OR disciplina_sec =?', [req.query.nombreArtistas, req.query.nombreArtistas, req.query.tecnicaArtistas, req.query.tecnicaArtistas]);
    }
    if (req.query.tecnicaArtistas && req.query.nombreArtistas) {
      artistas = await pool.query('SELECT * FROM usuarioArtista WHERE nombre =? OR apellido =? AND disciplina_principal =? OR disciplina_sec =?', [req.query.nombreArtistas, req.query.nombreArtistas, req.query.tecnicaArtistas, req.query.tecnicaArtistas]);
    }
  }


  res.render('general/artistas', {artistas, artista, logueado, nombre:nombre[0]});

});

router.get('/obras',  async (req, res) => {
  var obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

  if(req.query) { 

    if (req.query.tecnicaPinturas || req.query.artistaPinturas) {

      obras = await pool.query('SELECT * FROM obraCompleta WHERE nombre =? OR apellido =? OR tecnica =?', [req.query.artistaPinturas, req.query.artistaPinturas, req.query.tecnicaPinturas]);
    }
    if (req.query.tecnicaPinturas && req.query.artistaPinturas) {
      obras = await pool.query('SELECT * FROM obraCompleta WHERE nombre =? OR apellido =? AND tecnica =?', [req.query.artistaPinturas, req.query.artistaPinturas, req.query.tecnicaPinturas]);
    }
  }



  res.render('general/obras', {obras, artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/subasta', async (req, res) => {
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

  res.render('general/subasta',  {artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/subastas', async (req, res) => {
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

  res.render('general/subastas',  {artista, cliente, logueado, nombre:nombre[0]});
});


router.get('/evento/:id', async (req, res) => {
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

  const evento = await pool.query('SELECT * FROM eventos WHERE id =?', [req.params.id]);
  const fotos = await pool.query('SELECT * FROM fotosEventos WHERE evento_id =?', [req.params.id]);
  console.log(fotos)
  res.render('general/evento',  {evento: evento[0], fotos, artista, cliente, logueado, nombre:nombre[0]});
});

router.get('/eventos', async (req, res) => {
  artista = await isArtist(req);
  cliente = await isClient(req);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.params.id]);

  const eventos = await pool.query('SELECT * FROM eventoCompleto WHERE artista_id =?', [req.user.id]);
  res.render('general/eventos',  {eventos, artista, cliente, logueado, nombre:nombre[0]});
});


module.exports = router;