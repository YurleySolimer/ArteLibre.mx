const express = require('express');
const router = express.Router();


//-------------------VISTAS DEL ADMINISTRADOR---------------------//

router.get('/admin-artistas', (req, res) => { 
    res.render('admin/artistas');
});

router.get('/admin-colecciones', (req, res) => { 
    res.render('admin/colecciones');
});
  
router.get('/admin-estadisticas', (req, res) => { 
    res.render('admin/estadisticas');
});

router.get('/admin-eventos', (req, res) => { 
    res.render('admin/eventos');
});

router.get('/admin-obras', (req, res) => { 
    res.render('admin/obras');
});

router.get('/admin-subastas', (req, res) => { 
    res.render('admin/subastas');
});

router.get('/admin-estadisticas', (req, res) => { 
    res.render('admin/tasas');
});


  //-------------------VISTAS DEL ARTISTA---------------------//
router.get('/artistas-coleccion', (req, res) => { 
    res.render('artistas/coleccion');
});

router.get('/artistas-estadisticas', (req, res) => { 
    res.render('artistas/estadisticas');
});

router.get('/artistas-eventos', (req, res) => { 
    res.render('artistas/evento');
});

router.get('/artistas-home', (req, res) => { 
    res.render('artistas/home');
});

router.get('/artistas-mis-colecciones', (req, res) => { 
    res.render('artistas/mis-colecciones');
});

router.get('/artistas-mis-obras', (req, res) => { 
    res.render('artistas/mis-obras');
});

router.get('/artistas-perfil', (req, res) => { 
    res.render('artistas/perfil');
});

router.get('/artistas-mis-ventas', (req, res) => { 
    res.render('artistas/mis-ventas');
});

router.get('/artistas-mis-eventos', (req, res) => { 
    res.render('artistas/mis-eventos');
});

router.get('/artistas-contacto', (req, res) => { 
    res.render('artistas/contacto');
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