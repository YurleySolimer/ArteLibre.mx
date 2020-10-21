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

    const date = new Date();
    var hoy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var sieteDias = new Date(date.getFullYear(), date.getMonth(), date.getDate()-7);

    const transaccionesGeneral = await pool.query('select * from obraComprada where fecha_compra between ? and ?', [sieteDias, hoy]);
    var transaccionesTotal = 0;
    var ingresos = 0;    
   
    if (transaccionesGeneral.length > 0) {
        transaccionesTotal = transaccionesGeneral.length;
        for (var i = 0; i < transaccionesGeneral.length; i++) {
            ingresos = transaccionesGeneral[i].precio + ingresos;
        }
    }

    const eventosGeneral = await pool.query('select * from eventos where fecha_inicio between ? and ?', [sieteDias, hoy]);
    var eventos = 0;
    if( eventosGeneral.length > 0) {
        eventos = eventosGeneral.length;
    }

    const ultimaObra = await pool.query('select * from obraCompleta order by id desc limit 1');
    const galeria = await pool.query('select * from artistas order by visitasGaleria desc limit 1 ');
    const ultimaColeccion = await pool.query('select * from colecciones order by id desc limit 1');
    const obraVisitada = await pool.query('select * from obraCompleta order by visitas desc limit 1');
    const artistasRelevantes = await pool.query('select * from usuarioArtista order by visitas desc limit 3 ');
    const proximasSubastas = await pool.query('select * from obraSubasta order by fecha_inicio desc limit 3 ');
    const proximosEventos = await pool.query('select * from eventos order by fecha_inicio desc limit 3 ');


    res.render('admin/dashboard', {nombre: nombre[0], admin, transaccionesTotal, ingresos, eventos, proximosEventos, artistasRelevantes, proximasSubastas, ultimaObra:ultimaObra[0], obraVisitada:obraVisitada[0], ultimaColeccion:ultimaColeccion[0], galeria:galeria[0], logueado, dashboard});
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

    const clientesRegion = await pool.query('SELECT region, count(*) as numero from clientes  group by region order by numero desc limit 5');
    const clientesDestacados = await pool.query('SELECT * from usuarioCliente order by obrasCompradas desc limit 5');
    const clientesTotal = await pool.query('SELECT * from clientes');
    const compradoresTotal = await pool.query('SELECT id_user, count(*) as comprador from clienteCompra group by id_user');
    var compradoresTasa = 0;
    if (clientesTotal.length > 0 && compradoresTotal.length > 0) { 
        compradoresTasa = (compradoresTotal.length / clientesTotal.length) * 100;
    }
    const obrasTotal = await pool.query('Select precio from obraComprada');
    var precioSuma = 0;
    if (obrasTotal.length > 0) {
        for (var i = 0; i < obrasTotal.length; i++) {
            precioSuma = obrasTotal[i].precio + precioSuma;
        }
    var precioPromedio = precioSuma / obrasTotal.length

    }

    const artistasDestacados = await pool.query('SELECT *, avg(precio) as precioProm, count(id) as totalObras from obraComprada group by artista_id order by precioProm desc limit 5');
    const obrasSuma = await pool.query('SELECT *  FROM obras');
    const artistasSuma = await pool.query('SELECT *  FROM artistas');
    var promArtistasObra = 0;
    if (obrasSuma.length > 0 && artistasSuma.length > 0) {
        promArtistasObra = obrasSuma.length / artistasSuma.length
    }

    const totalGanancia = await pool.query('SELECT * from obraComprada');
    var promGanancia = 0;
    var sumGanancia = 0;
    if (totalGanancia.length > 0) {
        for (var j = 0; j < totalGanancia.length; j++) {
            sumGanancia = totalGanancia[j].precio + sumGanancia;
        }
        promGanancia = (sumGanancia / totalGanancia.length) * 0.85;
    }


    res.render('admin/rendimiento', {nombre: nombre[0], admin, precioPromedio, promArtistasObra, promGanancia, logueado, dashboard, clientesRegion, artistasDestacados, compradoresTasa, clientesDestacados});
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