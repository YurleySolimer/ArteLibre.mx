const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isArtista} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');

var artista = false;
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


router.get('/mis-ventas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  res.render('artist/mis-ventas', {nombre:nombre[0], artista, logueado});
});

router.get('/artista/galeria', async (req, res) => {
  res.render('artist/galeria');
});

router.get('/artist-perfil', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  const user = await pool.query('SELECT * FROM usuarioArtista WHERE id =?', [req.user.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  var ultima_obra = {
    nombreObra: 'N/A'
  }
  if (obras.length>0) {
    ultima_obra = obras[obras.length-1];
  }
  artista = true;
  logueado = true;
  res.render('artist/perfil', {nombre:nombre[0], user:user[0], obras, ultima_obra,  artista, logueado});
});

router.get('/mis-obras', isLoggedIn, isArtista, async (req, res)=> {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  res.render('artist/mis-obras', {obras, nombre:nombre[0],  artista, logueado});
});

router.get('/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  const artistainfo = ('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  console.log(artistainfo)
  const colecciones = await pool.query('SELECT nombreColeccion, id from colecciones WHERE artista_id =?', [artistainfo[0]]);
  res.render('artist/nueva-obra', {nombre:nombre[0], colecciones,  artista, logueado});
});

router.post('/nueva-obra',  isLoggedIn, isArtista, async (req, res) => {
    //GUARDANDO DATOS DE LA OBRA//
    const {nombre, coleccion, creacion, tecnica, estilo, precio, ancho, alto, subasta, copias, descripcion,lcreacion, fcreacion} = req.body;
    var nombreColeccion = 'N/A';
  
    if (coleccion > 0) { 
      nombreColeccion = await pool.query('SELECT nombreColeccion FROM colecciones WHERE id =?', [coleccion]);
      nombreColeccion = nombreColeccion[0];
    }
    const newObra = {
      nombreObra : nombre,
      coleccion : nombre,
      coleccion_id : coleccion,
      lugarCreacion: lcreacion,
      fecha_creacion : fcreacion,
      tecnica,
      estilo,
      ancho,
      alto,
      precio,
      descripcion,
      artista_id : req.user.id
    }

  const obra = await pool.query('INSERT INTO obras set ?', [newObra]);

  //GUARDANDO FOTOS DE LA OBRA//

  const fotos = req.files;
  var principal = 'false';
  for (var i = 0; i<fotos.length; i++) {
    if (i == fotos.length-1) {
      principal = true;
    }
    const path = fotos[i].path;
    var originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      principal,
      obra_id: obra.insertId
    }

    const foto = await pool.query('INSERT INTO fotosObras set ?', [newFoto]);
  }
  artista = true;
  logueado = true; 
  const fotoColeccion = {
    fotoNombre: originalname
  }
  await pool.query('UPDATE colecciones set? WHERE id=?', [fotoColeccion, coleccion])
  res.redirect('obras');
});

router.get('/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  res.render('artist/nueva-coleccion',  {nombre:nombre[0], artista, logueado});
});

router.post('/nueva-coleccion', async (req, res) => {
  const {nombre, año, descripcion, estilo, tecnica, ubicacionPais, ubicacionCiudad} = req.body;
  const artista_id = await pool.query('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  const newColeccion = {
    nombreColeccion: nombre,
    anio : año,
    descripcion,
    estilo,
    tecnica,
    pais : ubicacionPais,
    ciudad : ubicacionCiudad,
    artista_id : artista_id[0].id
  }
  await pool.query('INSERT into colecciones SET ?', [newColeccion]);
  res.redirect('colecciones');
});


module.exports = router;