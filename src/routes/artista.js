const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isArtista } = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');
const stripe = require('stripe')('sk_test_6WBQDi7VDQidnFxhgzQOtNBT007MvmFzD4');

var fs      = require('fs');


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

router.get("/connect/oauth", isLoggedIn, isArtista, async (req, res) => {
	const { code, state } = req.query;
  
	// Send the authorization code to Stripe's API.
	stripe.oauth.token({
		grant_type: 'authorization_code',
		code
	  }).then(
		async (response) => {
		  var connected_account_id = response.stripe_user_id;
		  await saveAccountId(connected_account_id, req, res);
	
      req.flash('success', 'Registro Exitoso')
      res.redirect('/dashboard/rendimiento');
		},
		(err) => {
			console.log(err)
		  if (err.type === 'StripeInvalidGrantError') {
			return res.status(400).json({error: 'Invalid authorization code: ' + code});
		  } else {
			return res.status(500).json({error: 'An unknown error occurred.'});
		  }
		}
	  );
  });
  
   
  async function saveAccountId (id, req, res) {
  console.log(id)
	const id_stripe = {
		id_stripe : id,
		estado : 'Registrado',
		id_user : req.user.id
	}
	await pool.query('INSERT INTO artistStripe SET?', [id_stripe]);
	
  console.log('Connected account ID: ' + id);

  }


//
// Dashboard
//

router.get('/dashboard', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const obras = await pool.query('SELECT * FROM obras WHERE artista_id =? ORDER BY visitas DESC LIMIT 5', [req.user.id]);
  const colecciones = await pool.query('SELECT * FROM colecciones WHERE artista_id =? ORDER BY visitas DESC LIMIT 5', [req.user.id]);
  const ultima_obra = await pool.query('SELECT * FROM obraCompleta WHERE principal =? AND artista_id =? ORDER BY id DESC LIMIT 1', ['True', req.user.id]);
  const evento = await pool.query('SELECT * FROM eventos WHERE artista_id =?  ORDER BY id DESC LIMIT 1', [req.user.id]);
  const subasta = await pool.query('SELECT * FROM obraSubasta WHERE artista_id =?  ORDER BY id DESC LIMIT 1', [req.user.id]);
  var visitas = await pool.query('SELECT visitas FROM artistas WHERE user_id =?', [req.user.id]);
  if (visitas.length > 0) {
    visitas = visitas[0].visitas;
  }
  else {
    visitas = 0;
  }

  res.render('artist/dashboard', { nombre: nombre[0], artista, logueado, dashboard, obras, colecciones, ultima_obra, evento, subasta, visitas });
});

router.get('/dashboard/ventas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const obras = await pool.query('SELECT * FROM obraComprada WHERE artista_id =?', [req.user.id]);
  res.render('artist/mis-ventas', { nombre: nombre[0], artista, logueado, dashboard, obras });
});

router.post('/dashboard/ventas/envio', isLoggedIn, isArtista, async (req, res) => {
  const codigo = req.body.codigo;
  const id = req.body.id;
  console.log(req.body)
  const newCodigo = {
    codigo,
    estadoObra: 'Enviado'
  }
  await pool.query('UPDATE clienteCompra SET? WHERE id =?', [newCodigo, id]);
  req.flash('success', 'Obra enviada');
  res.redirect('/dashboard/ventas');
});

router.get('/dashboard/eventos', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const eventos = await pool.query('SELECT * from eventoCompleto WHERE userID =?', [req.user.id]);
  const fotos = await pool.query('SELECT * FROM fotosEventos');
  res.render('artist/mis-eventos', { nombre: nombre[0], artista, logueado, dashboard, eventos });
});

router.get('/dashboard/subastas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const obras = await pool.query('SELECT * FROM obraSubasta WHERE artista_id=?', [req.user.id]);
  res.render('artist/mis-subastas', { nombre: nombre[0], artista, logueado, dashboard, obras });
});

router.get('/dashboard/colecciones', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const colecciones = await pool.query('SELECT * from coleccionArtista WHERE artista_id =?', [req.user.id]);
  res.render('artist/mis-colecciones', { nombre: nombre[0], artista, logueado, dashboard, colecciones });
});

router.get('/dashboard/rendimiento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido, email FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const email = nombre[0].email;
  const url = req.url;
  const artistStripe = await pool.query('SELECT * FROM artistStripe WHERE id_user =? LIMIT 1', [req.user.id]);
  var stripeRegistro = false;
  if (artistStripe.length > 0) {
    stripeRegistro = true;
  }

  const date = new Date();
  var hoy = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
  var sieteDias = new Date(date.getFullYear(), date.getMonth(), date.getDate()-7);
  var treintaDias = new Date(date.getFullYear(), date.getMonth(), date.getDate()-30);
  var diaSemana = hoy.getDay();


  //----------------OBRAS--------------------//

  var ventasSemana = 0;
  var ventasMes = 0;
  var estaSemana = {
    ventalunes : 0,
    ventamartes : 0,
    ventamiercoles : 0,
    ventajueves: 0,
    ventaviernes: 0,
    ventasabado: 0,
    ventadomingo: 0
  }

  var semanaPasada = {
    ventalunes0 : 0,
    ventamartes0 : 0,
    ventamiercoles0 : 0,
    ventajueves0: 0,
    ventaviernes0: 0,
    ventasabado0: 0,
    ventadomingo0: 0
  }

  if (diaSemana == 0) {

    const lunes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-6);
    const martes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-5);
    const miercoles =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-4);
    const jueves =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-3);
    const viernes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-2);
    const sabado =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-1);
    const domingo =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const lunes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-13);
    const martes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-12);
    const miercoles0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-11);
    const jueves0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-10);
    const viernes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-9);
    const sabado0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-8);
    const domingo0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-7);


    const ventalunes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes]);
    const ventamartes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes]);
    const ventamiercoles = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles]);
    const ventajueves = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves]);
    const ventaviernes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes]);
    const ventasabado = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado]);
    const ventadomingo = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo]);

    const ventalunes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes0]);
    const ventamartes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes0]);
    const ventamiercoles0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles0]);
    const ventajueves0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves0]);
    const ventaviernes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes0]);
    const ventasabado0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado0]);
    const ventadomingo0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo0]);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length
    }
  
    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length
    }

  }

  if (diaSemana == 1) {

    const lunes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const martes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+1);
    const miercoles =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+2);
    const jueves =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+3);
    const viernes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+4);
    const sabado =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+5);
    const domingo =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+6);

    const lunes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-7);
    const martes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-6);
    const miercoles0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-5);
    const jueves0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-4);
    const viernes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-3);
    const sabado0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-2);
    const domingo0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-1);


    const ventalunes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes]);
    const ventamartes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes]);
    const ventamiercoles = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles]);
    const ventajueves = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves]);
    const ventaviernes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes]);
    const ventasabado = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado]);
    const ventadomingo = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo]);

    const ventalunes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes0]);
    const ventamartes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes0]);
    const ventamiercoles0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles0]);
    const ventajueves0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves0]);
    const ventaviernes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes0]);
    const ventasabado0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado0]);
    const ventadomingo0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo0]);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length
    }
  
    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length
    }   
  }


  if (diaSemana == 2) {
    const lunes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-1);
    const martes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const miercoles =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+1);
    const jueves =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+2);
    const viernes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+3);
    const sabado =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+4);
    const domingo =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+5);

    const lunes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-8);
    const martes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-7);
    const miercoles0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-6);
    const jueves0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-5);
    const viernes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-4);
    const sabado0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-3);
    const domingo0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-2);


    const ventalunes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes]);
    const ventamartes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes]);
    const ventamiercoles = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles]);
    const ventajueves = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves]);
    const ventaviernes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes]);
    const ventasabado = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado]);
    const ventadomingo = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo]);

    const ventalunes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes0]);
    const ventamartes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes0]);
    const ventamiercoles0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles0]);
    const ventajueves0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves0]);
    const ventaviernes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes0]);
    const ventasabado0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado0]);
    const ventadomingo0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo0]);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length
    }
  
    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length
    }
    
  }


  if (diaSemana == 3) {
    const lunes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-2);
    const martes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-1);
    const miercoles =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const jueves =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+1);
    const viernes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+2);
    const sabado =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+3);
    const domingo =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+4);

    const lunes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-9);
    const martes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-8);
    const miercoles0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-7);
    const jueves0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-6);
    const viernes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-5);
    const sabado0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-4);
    const domingo0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-3);


    const ventalunes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes]);
    const ventamartes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes]);
    const ventamiercoles = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles]);
    const ventajueves = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves]);
    const ventaviernes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes]);
    const ventasabado = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado]);
    const ventadomingo = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo]);

    const ventalunes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes0]);
    const ventamartes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes0]);
    const ventamiercoles0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles0]);
    const ventajueves0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves0]);
    const ventaviernes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes0]);
    const ventasabado0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado0]);
    const ventadomingo0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo0]);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length
    }
  
    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length
    }

    
  }
  if (diaSemana == 4) {
    const lunes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-3);
    const martes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-2);
    const miercoles =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-1);
    const jueves =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const viernes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+1);
    const sabado =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+2);
    const domingo =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+3);

    const lunes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-10);
    const martes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-9);
    const miercoles0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-8);
    const jueves0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-7);
    const viernes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-6);
    const sabado0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-5);
    const domingo0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-4);


    const ventalunes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes]);
    const ventamartes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes]);
    const ventamiercoles = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles]);
    const ventajueves = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves]);
    const ventaviernes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes]);
    const ventasabado = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado]);
    const ventadomingo = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo]);

    const ventalunes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes0]);
    const ventamartes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes0]);
    const ventamiercoles0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles0]);
    const ventajueves0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves0]);
    const ventaviernes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes0]);
    const ventasabado0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado0]);
    const ventadomingo0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo0]);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length
    }
  
    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length
    }   
  }


  if (diaSemana == 5) {
    const lunes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-4);
    const martes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-3);
    const miercoles =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-2);
    const jueves =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-1);
    const viernes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const sabado =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+1);
    const domingo =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+2);

    const lunes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-11);
    const martes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-10);
    const miercoles0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-9);
    const jueves0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-8);
    const viernes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-7);
    const sabado0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-6);
    const domingo0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-5);


    const ventalunes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes]);
    const ventamartes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes]);
    const ventamiercoles = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles]);
    const ventajueves = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves]);
    const ventaviernes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes]);
    const ventasabado = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado]);
    const ventadomingo = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo]);

    const ventalunes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes0]);
    const ventamartes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes0]);
    const ventamiercoles0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles0]);
    const ventajueves0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves0]);
    const ventaviernes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes0]);
    const ventasabado0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado0]);
    const ventadomingo0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo0]);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length
    }
  
    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length
    }   
  }

  if (diaSemana == 6) {
    const lunes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-5);
    const martes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-4);
    const miercoles =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-3);
    const jueves =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-2);
    const viernes =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-1);
    const sabado =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const domingo =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+1);

    const lunes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-12);
    const martes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-11);
    const miercoles0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-10);
    const jueves0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-9);
    const viernes0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-8);
    const sabado0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-7);
    const domingo0 =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()-6);


    const ventalunes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes]);
    const ventamartes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes]);
    const ventamiercoles = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles]);
    const ventajueves = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves]);
    const ventaviernes = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes]);
    const ventasabado = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado]);
    const ventadomingo = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo]);

    const ventalunes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,lunes0]);
    const ventamartes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,martes0]);
    const ventamiercoles0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,miercoles0]);
    const ventajueves0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,jueves0]);
    const ventaviernes0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,viernes0]);
    const ventasabado0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,sabado0]);
    const ventadomingo0 = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra =?', [req.user.id,domingo0]);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length
    }
  
    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length
    }  
    
  }
  var ventaSemanal = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra BETWEEN ? AND ?', [req.user.id, sieteDias, hoy]);
  var ventaMensual = await pool.query('select * from obraComprada	where artista_id =? and  fecha_compra BETWEEN ? AND ?', [req.user.id, treintaDias, hoy]);

  if (ventaSemanal.length>0) {
   for (var i = 0; i < ventaSemanal.length; i++){
     ventasSemana = ventasSemana + ventaSemanal[i].precio;
   }
 }

 if (ventaMensual.length>=0) {
  for (var i = 0; i < ventaMensual.length; i++){
    ventasMes = ventasMes + ventaMensual[i].precio;
  }
}

const visitantesTotales =  await pool.query('select * from artistas	where user_id =?', [req.user.id]);;
const ventasTotales =   await pool.query('select * from obraComprada	where artista_id =?', [req.user.id]);
const conversionVisitas = (ventasTotales / visitantesTotales[0].visitas)*100;


//------------EXPOSICION------------------//

const colecciones = await pool.query('select * from colecciones where artista_id =? ORDER BY visitas DESC  LIMIT 5 ', [req.user.id]);
const evento = await pool.query('select * from eventos where artista_id =? ORDER BY id DESC  LIMIT 1 ', [req.user.id]);
var visitasEvento = 0;
if (evento.length>0) {
  visitasEvento = evento[0].visitas;
}
const eventos = await pool.query('select * from eventos where artista_id =? ', [req.user.id]);
var totalVisitasEventos = 0;
if (eventos.length > 0) {
  for (var i = 0; i < eventos.length; i++) {
    totalVisitasEventos = totalVisitasEventos + eventos[i].visitas;
  }
}


var estaSemanaPerfil = {
  perfillunes : 0,
  perfilmartes : 0,
  perfilmiercoles : 0,
  perfiljueves: 0,
  perfilviernes: 0,
  perfilsabado: 0,
  perfildomingo: 0
}

var semanaPasadaPerfil = {
  perfillunes0 : 0,
  perfilmartes0 : 0,
  perfilmiercoles0 : 0,
  perfiljueves0: 0,
  perfilviernes0: 0,
  perfilsabado0: 0,
  perfildomingo0: 0
}

var estaSemanaGaleria = {
  galerialunes : 0,
  galeriamartes : 0,
  galeriamiercoles : 0,
  galeriajueves: 0,
  galeriaviernes: 0,
  galeriasabado: 0,
  galeriadomingo: 0
}

var semanaPasadaGaleria = {
  galerialunes0 : 0,
  galeriamartes0 : 0,
  galeriamiercoles0 : 0,
  galeriajueves0: 0,
  galeriaviernes0: 0,
  galeriasabado0: 0,
  galeriadomingo0: 0
}



//---------------CLIENTES ----------------//

console.log(req.user.id)

const artistaCurrent = await pool.query('select * from artistas where user_id =? ', [req.user.id]);
var totalVisitasPerfil = 0;
var totalVisitasGaleria = 0;

totalVisitasPerfil = artistaCurrent[0].visitas;
totalVisitasGaleria = artistaCurrent[0].visitasGaleria;  




  res.render('artist/mi-rendimiento', { nombre: nombre[0], totalVisitasPerfil, totalVisitasGaleria, estaSemana, estaSemanaPerfil, estaSemanaGaleria, totalVisitasEventos, visitasEvento, colecciones, semanaPasada, semanaPasadaPerfil, semanaPasadaGaleria, ventasSemana, ventasMes, conversionVisitas, artista, logueado, email, url, dashboard, stripeRegistro });
});

router.get('/dashboard/obras', isLoggedIn, isArtista, async (req, res) => {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/mis-obras', { obras, nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/dashboard/obras/quitarGaleria/:id', isLoggedIn, isArtista, async (req, res) => {
  const galeria = {
      galeria : 'No',
  }
  await pool.query('UPDATE obras set? WHERE id=?', [galeria, req.params.id]); 
  req.flash('success', 'La no se mostrará en tu galería')
   
  res.redirect('/dashboard/obras');
});

router.get('/dashboard/obras/mostrarGaleria/:id', isLoggedIn, isArtista, async (req, res) => {
  const galeria = {
      galeria : 'Si',
  }
  await pool.query('UPDATE obras set? WHERE id=?', [galeria, req.params.id]);
  req.flash('success', 'La obra será mostrada en tu galería')
    
  res.redirect('/dashboard/obras');
});

router.get('/dashboard/obras/ocultar/:id', isLoggedIn, isArtista, async (req, res) => {
  const {id} = req.params;
  const ocultar = {
      ocultar : 'Si',
  }

  await pool.query('UPDATE obras set? WHERE id=?', [ocultar, id]);
  req.flash('success', 'La obra ha sido oculta')
  res.redirect('/dashboard/obras');
});

router.get('/dashboard/obras/mostrar/:id', isLoggedIn, isArtista, async (req, res) => {
  const {id} = req.params;
  const ocultar = {
      ocultar : 'No',
  }

  await pool.query('UPDATE obras set? WHERE id=?', [ocultar, id]);
  req.flash('success', 'La obra será mostrada')
  res.redirect('/dashboard/obras');
});

router.get('/dashboard/obras/eliminar/:id', isLoggedIn, isArtista, async (req, res) => {
  const {id} = req.params;

  await pool.query('DELETE from clienteCompra WHERE id_obra=?', [id]);
  await pool.query('DELETE from subastasInfo WHERE obra_id=?', [id]);
  await pool.query('DELETE from fotosObras WHERE obra_id=?', [id]);

  await pool.query('DELETE from obras WHERE id=?', [id]);
  req.flash('success', 'La obra ha sido eliminada')
  res.redirect('/dashboard/obras');
});

router.get('/dashboard/eventos/eliminar/:id', isLoggedIn, isArtista, async (req, res) => {
  const {id} = req.params;

  await pool.query('DELETE from fotosEventos WHERE evento_id=?', [id]);
  await pool.query('DELETE from eventos WHERE id=?', [id]);
  req.flash('success', 'El evento ha sido eliminado')
  res.redirect('/dashboard/eventos');
});


//
// Dashboard nuevos elementos GET
//

router.get('/dashboard/nuevo-evento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard-nuevo-evento', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/dashboard/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const artistainfo = ('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  console.log(artistainfo)
  const colecciones = await pool.query('SELECT nombreColeccion, id from colecciones WHERE artista_id =?', [artistainfo[0]]);
  res.render('artist/dashboard-nueva-obra', { nombre: nombre[0], colecciones, artista, logueado, dashboard });
});

router.get('/dashboard/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard-nueva-coleccion', { nombre: nombre[0], artista, logueado, dashboard });
});

//
// Nuevos elementos por fuera del dashboard GET
//

router.get('/nuevo-evento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
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
  const { nombreObra, coleccion, creacion, tecnica, estilo, precioFinal, ancho, alto, subasta, copias, descripcion, lcreacion, fcreacion } = req.body;
  var nombreColeccion = 'N/A';
  var subastar = 'No';

  if (subasta == 'on') {
    subastar = 'Si';
  }

  if (coleccion > 0) {
    nombreColeccion = await pool.query('SELECT nombreColeccion FROM colecciones WHERE id =?', [coleccion]);
    nombreColeccion = nombreColeccion[0];
  }

  const newObra = {
    nombreObra: nombreObra,
    coleccion: nombreColeccion.nombreColeccion,
    coleccion_id: coleccion,
    lugarCreacion: lcreacion,
    fecha_creacion: fcreacion,
    tecnica,
    estilo,
    ancho,
    alto,
    subastar,
    precio : precioFinal,
    descripcion,
    artista_id: req.user.id
  }

  const obra = await pool.query('INSERT INTO obras set ?', [newObra]);

  if (subastar == 'Si') {
    const newSubasta = {
      obra_id: obra.insertId
    }

    await pool.query('INSERT INTO subastasInfo set ?', [newSubasta]);
  }



  const artista_obras = await pool.query('SELECT * FROM obras WHERE artista_id =?', [req.user.id]);
  const numero_obras = {
    numero_obras : artista_obras.length
  }

  await pool.query('UPDATE artistas SET? WHERE user_id =?', [numero_obras, req.user.id]);

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

  const todoColeccicones = await pool.query('SELECT * from colecciones WHERE id =?', [coleccion])
  if (todoColeccicones.length > 0 ) { 
    var precioPromedio = ((todoColeccicones[0].precioPromedio) * 1) + ((precioFinal)*1);
    const colecicon_obras = await pool.query('SELECT * FROM obras WHERE coleccion_id =?', [coleccion]);
    var piezas = 0;
    if (colecicon_obras) {
      piezas = colecicon_obras.length;
    }
    else {
      piezas + 1;
    }

    console.log(precioPromedio)
    const NewColeccion = {
      fotoNombre: originalname,
      precioPromedio,
      piezas
    }
  await pool.query('UPDATE colecciones set? WHERE id=?', [NewColeccion, coleccion]);
  }

  if (dashboard) {
    res.redirect('/dashboard')
  } else {
    res.redirect('/dashboard/obras');
  };
});

router.post('/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const { nombre, año, descripcion, estilo, tecnica, ubicacionPais, ubicacionCiudad } = req.body;
  const newColeccion = {
    nombreColeccion: nombre,
    anio: año,
    descripcion,
    estilo,
    tecnica,
    pais: ubicacionPais,
    ciudad: ubicacionCiudad,
    artista_id: req.user.id
  }
  await pool.query('INSERT into colecciones SET ?', [newColeccion]);

  const artista_colecciones = await pool.query('SELECT * FROM colecciones WHERE artista_id =?', [req.user.id]);
  const numero_colecciones = {
    numero_colecciones : artista_colecciones.length
  }

  await pool.query('UPDATE artistas SET? WHERE user_id =?', [numero_colecciones, req.user.id]);

  if(dashboard) {
    res.redirect('/dashboard/nueva-obra')
  } else {
    res.redirect('nueva-obra');
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

  const evento = await pool.query('INSERT INTO eventos SET?', [newEvento] );
  const artista_eventos = await pool.query('SELECT * FROM eventos WHERE artista_id =?', [req.user.id]);
  const numero_eventos = {
    numero_eventos : artista_eventos.length
  }

  await pool.query('UPDATE artistas SET? WHERE user_id =?', [numero_eventos, req.user.id]);

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
      res.redirect('/dashboard')
    } else {
      res.redirect('/dashboard/eventos')
    };
});

router.post('/dashboard/eventos/editar/:id', isLoggedIn, isArtista, async (req, res) => {
  const {id} = req.params;

  const {nombre, titulo, organizadores, hora, inicio, fin, local, direccion, piezas, ciudad, pais, estilo} = req.body;
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
    estilo
  }

  const evento = await pool.query('UPDATE eventos SET ? WHERE id =?', [newEvento, id] );
  req.flash('success', 'Evento actualizado');
  res.redirect('/dashboard/eventos')
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
    nombreObra: 'N/A',
    id: '#'
  }
  if (obras.length > 0) {
    ultima_obra = obras[obras.length - 1];
  }
  artista = true;
  logueado = true;
  dashboard = false;
  res.render('artist/perfil', { nombre: nombre[0], user: user[0], obras, ultima_obra, artista, logueado, dashboard });
});

router.post('/editar-Artista', isLoggedIn, isArtista, async (req, res) => {

  const {fullname, email, apellido, telefono} = req.body;
  var path = '';
  var originalname = '';
  
  if(req.body.image) {
    var img = req.body.image;
    // luego extraes la cabecera del data url
    var base64Data = img.replace(/^data:image\/png;base64,/, "");
    var path = `src/public/uploads/${fullname}${email}.png`;
    var originalname = `${fullname}${email}.png`;

    // grabas la imagen el disco
    fs.writeFile(`src/public/uploads/${fullname}${email}.png`, base64Data, 'base64', function(err) {
        console.log(err);
    });    
  }

  
  let newUser = {
    nombre: fullname,
    email, 
    apellido,
    telefono,
    foto_ubicacion : path,
		foto_nombre: originalname,
  };

    const result = await pool.query('UPDATE users SET ? WHERE id=? ', [newUser, req.body.idArtist]);

    console.log(req.body)

console.log(result)

    const {pais, region, provincia, años, direccion, disciplina_principal, estilo, frase, biografia} = req.body;

    let newArtista = {
      pais,
      region, 
      provincia,
      años_experiencia: años,
      direccion,
      disciplina_principal,
      biografia,
      frase
    };

  
    const artist = await pool.query('UPDATE artistas SET ? WHERE user_id=? ', [newArtista, req.body.idArtist]);
  console.log(artist)

  res.redirect('/artist-perfil');
});

module.exports = router;