const express = require('express');
const router = express.Router();


//-------------------VISTAS DEL ADMINISTRADOR---------------------//




  //-------------------VISTAS DEL ARTISTA---------------------//

  router.get('/nueva-obra', (req, res) => {
      res.render('artist/nueva-obra');
  });



/*
  //-------------------VISTAS DEL CLIENTE---------------------//
router.get('/admin-estadisticas', (req, res) => { 
    res.render('admin/estadisticas');
  });
*/

router.get('/obra', (req, res) => {
    res.render('client/obra');
});

router.get('/artista', (req, res) => {
    res.render('client/artista');
});

router.get('/artistas', (req, res) => {
    res.render('client/artistas');
});

router.get('/obras', (req, res) => {
    res.render('client/obras');
});

/*
  //-------------------VISTAS GENERALES---------------------//
router.get('/admin-estadisticas', (req, res) => { 
    res.render('admin/estadisticas');
  }); */

module.exports = router;