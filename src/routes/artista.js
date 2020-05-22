const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isArtista} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');

const Handlebars = require('handlebars');

Handlebars.registerHelper('año', function(date) {
  const año = date.getFullYear();  
  return año;
});

router.get('/mis-ventas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/mis-ventas', {nombre:nombre[0]});
});

router.get('/a-perfil', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  const user = await pool.query('SELECT * FROM usuarioArtista WHERE id =?', [req.user.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  var ultima_obra = {
    nombreObra: 'N/A'
  }
  if (obras.length>0) {
    ultima_obra = obras[obras.length-1];
  }
  res.render('artist/perfil', {nombre:nombre[0], user:user[0], obras, ultima_obra});
});

router.get('/mis-obras', isLoggedIn, isArtista, async (req, res)=> {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/mis-obras', {obras, nombre:nombre[0]});
});

router.get('/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/nueva-obra', {nombre:nombre[0]});
});

router.post('/nueva-obra',  isLoggedIn, isArtista, async (req, res) => {
    //GUARDANDO DATOS DE LA OBRA//
    const {nombre, coleccion, creacion, tecnica, estilo, precio, ancho, alto, subasta, copias, descripcion} = req.body;
    const newObra = {
      nombreObra : nombre,
      coleccion,
      lugarCreacion: creacion,
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
    const originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      principal,
      obra_id: obra.insertId
    }

    const foto = await pool.query('INSERT INTO fotosObras set ?', [newFoto]);
  } 
    res.redirect('a-obras');
});

router.get('nueva-coleccion', (req, res) => {
  res.render('artist/nueva-coleccion');
});

router.get('/a-coleccion', isLoggedIn, isArtista, async(req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/coleccion', {nombre:nombre[0]});
});

router.get('/a-colecciones', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/colecciones', {nombre:nombre[0]});
});

router.get('/a-obra/:id', isLoggedIn, isArtista, async (req, res) => {
  const obra = await pool.query('SELECT * FROM obraCompleta WHERE id =?', [req.params.id]);
  const fotos = await pool.query('SELECT * FROM fotosObras WHERE obra_id=?', [req.params.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);

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
  res.render('artist/obra', {obra:obra[0], fotos, myArray, nombre:nombre[0]});
});


router.get('/a-artista', isLoggedIn, isArtista, async(req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/artista', {nombre:nombre[0]});
});

router.get('/a-artistas', isLoggedIn, isArtista, async (req, res) => {
  const artistas = await pool.query('SELECT * FROM usuarioArtista');
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/artistas', {artistas, nombre:nombre[0]});
});

router.get('/a-obras', isLoggedIn, isArtista, async (req, res) => {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('artist/obras', {obras, nombre:nombre[0]});
});

module.exports = router;