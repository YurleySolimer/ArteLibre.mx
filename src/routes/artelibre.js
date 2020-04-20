const express = require('express');
const router = express.Router();


//-------------------VISTAS DEL ADMINISTRADOR---------------------//




//-------------------ARTISTS VIEWS---------------------//

router.get('/nueva-obra', (req, res) => {
  res.render('artist/nueva-obra');
});

router.get('/registro-artista', (req, res) => {
  res.render('artist/registro');
});


//-------------------CLIENTS VIEWS---------------------//

router.get('/registro-cliente', (req, res) => {
  res.render('client/registro');
});

//-------------------GENERAL VIEWS---------------------//

router.get('/obra', (req, res) => {
  res.render('general/obra');
});

router.get('/artista', (req, res) => {
  res.render('general/artista');
});

router.get('/artistas', (req, res) => {
  res.render('general/artistas');
});

router.get('/obras', (req, res) => {
  res.render('general/obras');
});

router.get('/registro', (req, res) => {
  res.render('general/registro');
});



module.exports = router;