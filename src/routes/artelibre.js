const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/coleccion', (req, res) => {
  res.render('general/coleccion');
});

router.get('/registro', (req, res) => {
  res.render('general/registro');
});

router.get('/colecciones', (req, res) => {
  res.render('general/colecciones');
});

router.get('/obra/:id', async (req, res) => {
  const obra = await pool.query('SELECT * FROM obraCompleta WHERE id =?', [req.params.id]);
  const fotos = await pool.query('SELECT * FROM fotosObras WHERE obra_id=?', [req.params.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  console.log(obras.length)

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
  res.render('general/obra', {obra:obra[0], fotos, myArray});
});


router.get('/artista', (req, res) => {
  res.render('general/artista');
});

router.get('/artistas', async (req, res) => {
  const artistas = await pool.query('SELECT * FROM usuarioArtista');
  res.render('general/artistas', {artistas});
});

router.get('/obras', async (req, res) => {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE principal =?', ['True']);
  res.render('general/obras', {obras});
});



module.exports = router;