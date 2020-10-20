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
const { isAdmin } = require('../lib/auth');

const { isLoggedIn } = require('../lib/auth');

var admin = false;
var logueado = false;
var dashboard = false;

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if(v1 === v2) {
	  return options.fn(this);
	}
	return options.inverse(this);
  });

router.get('/admin/artistas', isLoggedIn, isAdmin, async (req, res) => {
    var artistasCompletos = await pool.query('SELECT * FROM usuarioArtista');
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
   

    
    res.render('admin/artistas', {nombre: nombre[0], admin, logueado, dashboard, artistasCompletos});
});

router.post('/admin/artistas/destacar', isLoggedIn, isAdmin, async (req, res) => {
    

    const {id, text} = req.body;
    const destacar = {
        destacar : 'Si',
        info_destacar : text
    }
    await pool.query('UPDATE artistas set? WHERE id=?', [destacar, id]);
    res.redirect('/admin/artistas');
});

router.post('/admin/artistas/suspender/:id', isLoggedIn, isAdmin, async (req, res) => {
    const inactivo = {
        inactivo : 'Si',
    }
    await pool.query('UPDATE artistas set? WHERE id=?', [inactivo, req.params.id]);
    res.redirect('/admin/artistas');
});


router.get('/admin/obras', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    var obras = await pool.query('SELECT * FROM obraCompleta');
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    res.render('admin/obras', {nombre: nombre[0], admin, logueado, dashboard, obras});
});

router.get('/admin/obras/ocultar/:id', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    const ocultar = {
        ocultar : 'Si',
    }
    await pool.query('UPDATE obras set? WHERE id=?', [ocultar, req.params.id]);    
res.redirect('/admin/obras');
});

router.post('/admin/obras/destacar', isLoggedIn, isAdmin, async (req, res) => {
    const {id} = req.body;
    const destacar = {
        destacar : 'Si',
    }
    await pool.query('UPDATE obras set? WHERE id=?', [destacar, id]);
    res.redirect('/admin/obras');
}); 


router.post('/admin/obras/recomendar', isLoggedIn, isAdmin, async (req, res) => {
    const {id, text} = req.body;
    console.log('holi')
    const recomendar = {
        recomendar : 'Si',
        titulo_recomendada : text
    }
    await pool.query('UPDATE obras set? WHERE id=?', [recomendar, id]);
    res.redirect('/admin/obras');
}); 



router.get('/admin/colecciones', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    const colecciones = await pool.query('SELECT * from coleccionArtista');
    res.render('admin/colecciones', {nombre: nombre[0], admin, logueado, dashboard, colecciones});
});

router.post('/admin/colecciones/destacar', isLoggedIn, isAdmin, async (req, res) => {
    const {id} = req.body;
    const destacar = {
        destacar : 'Si',
    }
    await pool.query('UPDATE colecciones set? WHERE id=?', [destacar, id]);
    res.redirect('/admin/colecciones');
}); 

router.get('/admin/colecciones/ocultar/:id', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    const ocultar = {
        ocultar : 'Si',
    }
    await pool.query('UPDATE colecciones set? WHERE id=?', [ocultar, req.params.id]);    
res.redirect('/admin/colecciones');
});


router.get('/admin/dashboard', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    res.render('admin/dashboard', {nombre: nombre[0], admin, logueado, dashboard});
});
router.get('/admin/tasas', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    res.render('admin/tasas', {nombre: nombre[0], admin, logueado, dashboard});
});
router.get('/admin/rendimiento', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    res.render('admin/rendimiento', {nombre: nombre[0], admin, logueado, dashboard});
});
router.get('/admin/subastas', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    var obras = await pool.query('SELECT * FROM obraSubasta');
    res.render('admin/subastas', {nombre: nombre[0], admin, logueado, dashboard, obras});
});

router.post('/admin/subastas/publicar', isLoggedIn, isAdmin, async (req, res) => {
    const {precioBase, horaInicio, fechaInicio, descripcion, duracion, id} = req.body;
    const newSubasta = {
        fecha_inicio: fechaInicio,
        hora_inicio: horaInicio,
        duracion,
        precio_base: precioBase,
        descripcion,
        estadoSubasta: 'Publicada'
    }

    await pool.query('UPDATE subastasInfo set? WHERE id =?', [newSubasta, id]);

    res.redirect('/admin/subastas');
});


router.get('/admin/clientes', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    var clientesCompletos = await pool.query('SELECT * FROM usuarioCliente');

    res.render('admin/clientes', {nombre: nombre[0], admin, logueado, dashboard, clientesCompletos});
});
router.get('/admin/eventos', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    const eventos = await pool.query('SELECT * FROM eventoCompleto');

    res.render('admin/eventos', {nombre: nombre[0], admin, logueado, dashboard, eventos});
});
router.get('/admin/ventas', isLoggedIn, isAdmin, async (req, res) => {
    admin = true;
    logueado = true;
    const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);

    res.render('admin/ventas', {nombre: nombre[0], admin, logueado, dashboard});
});

module.exports = router;