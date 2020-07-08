const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isArtista } = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');

var artista = false;
var logueado = false;
var dashboard = false;

const Handlebars = require('handlebars');


Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

//
// Dashboard
//

router.get('/artista/dashboard', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/artista/ventas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/mis-ventas', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/artista/eventos', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/artista/subastas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/artista/colecciones', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/artista/rendimiento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/artista/obras', isLoggedIn, isArtista, async (req, res) => {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/mis-obras', { obras, nombre: nombre[0], artista, logueado, dashboard });
});

//
// Dashboard nuevos elementos GET
//

router.get('/artista/nuevo-evento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard-nuevo-evento', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/artista/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const artistainfo = ('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  console.log(artistainfo)
  const colecciones = await pool.query('SELECT nombreColeccion, id from colecciones WHERE artista_id =?', [artistainfo[0]]);
  res.render('artist/dashboard-nueva-obra', { nombre: nombre[0], colecciones, artista, logueado, dashboard });
});

router.get('/artista/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard-nueva-coleccion', { nombre: nombre[0], artista, logueado, dashboard });
});

//
// Nuevos elementos por fuera del dashboard GET
//

router.get('/nuevo-evento', isLoggedIn, isArtista, (req, res) => {
  artista = true;
  logueado = true;
  dashboard = false;
  res.render('artist/nuevo-evento', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = false;
  const artistainfo = ('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  console.log(artistainfo)
  const colecciones = await pool.query('SELECT nombreColeccion, id from colecciones WHERE artista_id =?', [artistainfo[0]]);
  res.render('artist/nueva-obra', { nombre: nombre[0], colecciones, artista, logueado, dashboard });
});

router.get('/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = false;
  res.render('artist/nueva-coleccion', { nombre: nombre[0], artista, logueado, dashboard });
});

//
// Nuevos elementos POST
//

router.post('/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  //GUARDANDO DATOS DE LA OBRA//
  const { nombre, coleccion, creacion, tecnica, estilo, precio, ancho, alto, subasta, copias, descripcion, lcreacion, fcreacion } = req.body;
  var nombreColeccion = 'N/A';

  if (coleccion > 0) {
    nombreColeccion = await pool.query('SELECT nombreColeccion FROM colecciones WHERE id =?', [coleccion]);
    nombreColeccion = nombreColeccion[0];
  }
  const newObra = {
    nombreObra: nombre,
    coleccion: nombre,
    coleccion_id: coleccion,
    lugarCreacion: lcreacion,
    fecha_creacion: fcreacion,
    tecnica,
    estilo,
    ancho,
    alto,
    precio,
    descripcion,
    artista_id: req.user.id
  }

  const obra = await pool.query('INSERT INTO obras set ?', [newObra]);

  //GUARDANDO FOTOS DE LA OBRA//

  const fotos = req.files;
  var principal = 'false';
  for (var i = 0; i < fotos.length; i++) {
    if (i == fotos.length - 1) {
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

  if (dashboard) {
    res.redirect('/artista/dashboard')
  } else {
    res.redirect('/obras');
  };
});

router.post('/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const { nombre, año, descripcion, estilo, tecnica, ubicacionPais, ubicacionCiudad } = req.body;
  const artista_id = await pool.query('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  const newColeccion = {
    nombreColeccion: nombre,
    anio: año,
    descripcion,
    estilo,
    tecnica,
    pais: ubicacionPais,
    ciudad: ubicacionCiudad,
    artista_id: artista_id[0].id
  }
  await pool.query('INSERT into colecciones SET ?', [newColeccion]);

  if(dashboard) {
    res.redirect('/artista/dashboard')
  } else {
    res.redirect('colecciones');
  };
});


router.post('/nuevo-evento', isLoggedIn, isArtista, async (req,res) => {
  const {nombre, titulo, organizadores, hora, inicio, fin, local, direccion, piezas, ciudad, pais, estilo, descripcion } = req.body;
  const newEvento = {
    nombre,
    titulo,
    organizadores,
    hora_inicio: hora,
    fecha_inicio: inicio,
    fecha_fin: fin,
    dir_local: local,
    direccion,
    ciudad,
    pais,
    piezas,
    estilo,
    descripcion,
    artista_id: req.user.id
  }

  const evento = await pool.query('INSERT INTO eventos SET?', [newEvento] )

   for (var i = 0 ; i<req.files.length; i ++) {
     var principal = 'false';
      if (i==0) { 
        principal = 'true';
      }
      else {
        principal = 'false';
      }
      const {originalname, path} = req.files[i];
      const newFotoEvento = {
        fotoNombre: originalname,
        fotoUbicacion: path,
        evento_id: evento.insertId,
        principal
      }
      await pool.query('INSERT INTO fotosEventos SET?', [newFotoEvento]);
    }
    if(dashboard) {
      res.redirect('/artista/dashboard')
    } else {
      res.redirect('eventos')
    };
});

router.post('/obra/editar/:id', isLoggedIn, isArtista, async (req, res)=> {
  const {id} = req.body;

    //ACTUALIZANDO DATOS DE LA OBRA//
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

    const obra = await pool.query('UPDATE obras set ? WHERE id =?', [newObra, id]);

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
      obra_id: id
    }

    const foto = await pool.query('INSERT INTO fotosObras set ?', [newFoto]);
    }
    const fotoColeccion = {
    fotoNombre: originalname
    }
    await pool.query('UPDATE colecciones set? WHERE id=?', [fotoColeccion, coleccion])

  res.redirect('/obra/'+id);
});

//
// Perfil
//

router.get('/artist-perfil', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  const user = await pool.query('SELECT * FROM usuarioArtista WHERE id =?', [req.user.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  var ultima_obra = {
    nombreObra: 'N/A'
  }
  if (obras.length > 0) {
    ultima_obra = obras[obras.length - 1];
  }
  artista = true;
  logueado = true;
  dashboard = false;
  res.render('artist/perfil', { nombre: nombre[0], user: user[0], obras, ultima_obra, artista, logueado, dashboard });
});

module.exports = router;