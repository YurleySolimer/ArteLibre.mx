const express = require('express');
const router = express.Router();
const pool = require('../database');
const helpers = require('../lib/helpers');

const passport = require('passport');


const Handlebars = require('handlebars');

Handlebars.registerHelper('fecha', function(date) {
  const dia = date.getDate();
  const mes = date.getMonth()+1;
  const año = date.getFullYear();	  
  return `${dia} - ${mes} - ${año}`;
});

const { isArtista } = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if(v1 === v2) {
	  return options.fn(this);
	}
	return options.inverse(this);
  });

router.get('/admin/artistas', isLoggedIn, async (req, res) => {
    var artistasCompletos = await pool.query('SELECT * FROM usuarioArtista');
    
    res.render('admin/artistas', {artistasCompletos});
});

router.post('/admin/artistas/destacar', isLoggedIn, async (req, res) => {
    const {id, text} = req.body;
    const destacar = {
        destacar : 'Si',
        info_destacar : text
    }
    await pool.query('UPDATE artistas set? WHERE id=?', [destacar, id]);
    res.redirect('/admin/artistas');
});

router.post('/admin/artistas/suspender/:id', isLoggedIn, async (req, res) => {
    const inactivo = {
        inactivo : 'Si',
    }
    await pool.query('UPDATE artistas set? WHERE id=?', [inactivo, req.params.id]);
    res.redirect('/admin/artistas');
});


router.get('/admin/obras', isLoggedIn, async (req, res) => {
    var obras = await pool.query('SELECT * FROM obraCompleta');
    res.render('admin/obras', {obras});
});

router.get('/admin/obras/ocultar/:id', isLoggedIn, async (req, res) => {
    const ocultar = {
        ocultar : 'Si',
    }
    await pool.query('UPDATE obras set? WHERE id=?', [ocultar, req.params.id]);    
res.redirect('/admin/obras');
});

router.post('/admin/obras/destacar', isLoggedIn, async (req, res) => {
    const {id} = req.body;
    const destacar = {
        destacar : 'Si',
    }
    await pool.query('UPDATE obras set? WHERE id=?', [destacar, id]);
    res.redirect('/admin/obras');
}); 


router.post('/admin/obras/recomendar', isLoggedIn, async (req, res) => {
    const {id, text} = req.body;
    console.log('holi')
    const recomendar = {
        recomendar : 'Si',
        titulo_recomendada : text
    }
    await pool.query('UPDATE obras set? WHERE id=?', [recomendar, id]);
    res.redirect('/admin/obras');
}); 



router.get('/admin/colecciones', isLoggedIn, async (req, res) => {
    const colecciones = await pool.query('SELECT * from coleccionArtista');
    res.render('admin/colecciones', {colecciones});
});

router.post('/admin/colecciones/destacar', isLoggedIn, async (req, res) => {
    const {id} = req.body;
    const destacar = {
        destacar : 'Si',
    }
    await pool.query('UPDATE colecciones set? WHERE id=?', [destacar, id]);
    res.redirect('/admin/colecciones');
}); 

router.get('/admin/colecciones/ocultar/:id', isLoggedIn, async (req, res) => {
    const ocultar = {
        ocultar : 'Si',
    }
    await pool.query('UPDATE colecciones set? WHERE id=?', [ocultar, req.params.id]);    
res.redirect('/admin/colecciones');
});


router.get('/admin/dashboard', isLoggedIn, (req, res) => {
    res.render('admin/dashboard');
});
router.get('/admin/tasas', isLoggedIn, (req, res) => {
    res.render('admin/tasas');
});
router.get('/admin/rendimiento', isLoggedIn, (req, res) => {
    res.render('admin/rendimiento');
});
router.get('/admin/subastas', isLoggedIn, (req, res) => {
    res.render('admin/subastas');
});
router.get('/admin/clientes', isLoggedIn, (req, res) => {
    res.render('admin/clientes');
});
router.get('/admin/eventos', isLoggedIn, async (req, res) => {
    const eventos = await pool.query('SELECT * FROM eventoCompleto');

    res.render('admin/eventos', {eventos});
});
router.get('/admin/ventas', isLoggedIn, (req, res) => {
    res.render('admin/ventas');
});

module.exports = router;