const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isCliente} = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');


router.get('/compras', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('client/compras');
});

router.get('/mis-pedidos', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('client/mis-pedidos');
});

router.get('/c-coleccion', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('client/coleccion');
});

router.get('/c-colecciones', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('client/colecciones');
});

router.get('/c-obra/:id', isLoggedIn, isCliente, async (req, res) => {
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
  res.render('client/obra', {obra:obra[0], fotos, myArray});
});


router.get('/c-artista', isLoggedIn, isCliente, async (req, res) => {
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('client/artista');
});

router.get('/c-artistas', isLoggedIn, isCliente, async (req, res) => {
  const artistas = await pool.query('SELECT * FROM usuarioArtista');
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('client/artistas', {artistas});
});

router.get('/c-obras', isLoggedIn, isCliente, async (req, res) => {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  const nombre = await pool.query('SELECT nombre FROM users WHERE id =?', [req.user.id]);
  res.render('client/obras', {obras});
});

module.exports = router;