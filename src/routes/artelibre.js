const express = require("express");
const router = express.Router();
const pool = require("../database");

const stripe = require("stripe")("sk_test_6WBQDi7VDQidnFxhgzQOtNBT007MvmFzD4");

var artista = false;
var cliente = false;
var admin = false;
var nombre = {
  nombre: "",
  apellido: "",
};
var logueado = false;
const Handlebars = require("handlebars");
const getCollection = require("../arteLibre-controllers/getCollection");
const getSignUp = require("../arteLibre-controllers/getSignUp");
const getCollections = require("../arteLibre-controllers/getCollections");
const getObra = require("../arteLibre-controllers/getObra");
const getUserStripe = require("../arteLibre-controllers/getUserStripe");
const stripeSession = require("../arteLibre-controllers/stripeSession");
const getObraSuccess = require("../arteLibre-controllers/obraSuccess");
const getArtist = require("../arteLibre-controllers/getArtist");
const getArtistGallery = require("../arteLibre-controllers/getArtistGallery");
const getArtists = require("../arteLibre-controllers/getArtists");
const getObras = require("../arteLibre-controllers/getObras");
const getAuction = require("../arteLibre-controllers/getAuction");
const getAuctions = require("../arteLibre-controllers/getAuctions");
const getEvent = require("../arteLibre-controllers/getEvent");
const getEvents = require("../arteLibre-controllers/getEvents");

Handlebars.registerHelper("fecha", function (date) {
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();
  return `${dia} - ${mes} - ${año}`;
});

async function isArtist(req) {
  if (req.isAuthenticated()) {
    var usuario = await pool.query("SELECT tipo FROM users WHERE id =?", [
      req.user.id,
    ]);

    if (usuario[0].tipo == "Artista") {
      logueado = true;
      return true;
    }
    return false;
  } else {
    logueado = false;
    return false;
  }
}

async function isClient(req) {
  if (req.isAuthenticated()) {
    var usuario = await pool.query("SELECT tipo FROM users WHERE id =?", [
      req.user.id,
    ]);

    if (usuario[0].tipo == "Cliente") {
      logueado = true;
      return true;
    }
    return false;
  } else {
    logueado = false;
    return false;
  }
}

async function isAdmin(req) {
  if (req.isAuthenticated()) {
    var usuario = await pool.query("SELECT tipo FROM users WHERE id =?", [
      req.user.id,
    ]);

    if (usuario[0].tipo == "Admin") {
      logueado = true;
      return true;
    }
    return false;
  } else {
    logueado = false;
    return false;
  }
}

router.get("/coleccion/:id", async (req, res) => {
  const collection = await getCollection(req);

  res.render("general/coleccion", {
    colecciones: collection.colecciones[0],
    obras: collection.obras,
    myArray: collection.myArray,
    artista: collection.artista,
    cliente: collection.cliente,
    admin: collection.admin,
    logueado: collection.logueado,
    nombre: collection.nombre[0],
  });
});

router.get("/registro", async (req, res) => {
  const signUp = await getSignUp(req);

  res.render("general/registro", {
    artista: signUp.artista,
    cliente: signUp.cliente,
    admin: signUp.admin,
    logueado: signUp.logueado,
    nombre: signUp.nombre[0],
  });
});

router.get("/colecciones", async (req, res) => {
  const collections = await getCollections(req);
  res.render("general/colecciones", {
    colecciones: collections.colecciones,
    artista: collections.artista,
    cliente: collections.cliente,
    admin: collections.admin,
    logueado: collections.logueado,
    nombre: collections.nombre[0],
  });
});

router.get("/obra/:id", async (req, res) => {
  const obra = await getObra(req);
  const cliente = obra.cliente;

  if (cliente == true) {
    var userStripe = await getUserStripe(req);
    var uStripe = false;

    if (userStripe.userStripe.length > 0) {
      var userID = userStripe.userStripe[0].id_stripe;
      uStripe = true;
      const sessionS = await stripeSession(req, userID);

      res.render("general/obra", {
        obra: obra.obra[0],
        fotos: obra.fotos,
        myArray: obra.myArray,
        artista: obra.artista,
        cliente: obra.cliente,
        admin: obra.admin,
        logueado: obra.logueado,
        nombre: obra.nombre[0],
        session_id: sessionS.session_id,
        uStripe,
      });
    } else {
      res.render("general/obra", {
        obra: obra.obra[0],
        fotos: obra.fotos,
        myArray: obra.myArray,
        artista: obra.artista,
        cliente: obra.cliente,
        admin: obra.admin,
        logueado: obra.logueado,
        nombre: obra.nombre[0],
        session_id: sessionS.session_id,
        uStripe,
      });
    }
  } else {
    res.render("general/obra", {
      obra: obra.obra[0],
      fotos: obra.fotos,
      myArray: obra.myArray,
      artista: obra.artista,
      cliente: obra.cliente,
      admin: obra.admin,
      logueado: obra.logueado,
      nombre: obra.nombre[0],
    });
  }
});

router.get("/obra/success/:id", async (req, res) => {
  const obra = await getObraSuccess(req)
  const id = req.params.id;
  if (obra) { 

    req.flash("success", "Felicidades, ha comprado la obra exitosamente");
    res.redirect(`/obra/${id}`);
  } else {
    res.redirect(`/obra/${id}`);
  }
});

router.get("/artista/:id", async (req, res) => {
 const artist = await getArtist(req)
  res.render("general/artista", {
    user: artist.user[0],
    colecciones: artist.colecciones,
    eventos: artist.eventos,
    obras: artist.obras,
    ultima_obra: artist.ultima_obra,
    artista: artist.artista,
    cliente: artist.cliente,
    admin: artist.admin,
    logueado: artist.logueado,
    nombre: artist.nombre[0],
  });
});

router.get("/artista/:id/galeria", async (req, res) => {
  const artist = await getArtistGallery(req)
  res.render("artist/galeria", {
    user: artist.user[0],
    obras1: artist.obras1,
    obras2: artist.obras2,
    artista: artist.artista,
    cliente: artist.cliente,
    admin: artist.admin,
    logueado: artist.logueado,
    nombre: artist.nombre[0],
  });
});

router.get("/artistas", async (req, res) => {
  const artists = await getArtists(req)

  res.render("general/artistas", {
    artistas: artists.artistas,
    artista: artists.artista,
    cliente: artists.cliente,
    logueado: artists.logueado,
    admin: artists.admin,
    nombre: artists.nombre[0],
  });
});

router.get("/obras", async (req, res) => {
  const obras = await getObras(req)
  res.render("general/obras", {
    obras: obras.obras,
    artista: obras.artista,
    cliente: obras.cliente,
    logueado: obras.logueado,
    admin: obras.admin,
    nombre: obras.nombre[0],
  });
});

router.get("/subasta/:id", async (req, res) => {
  const auction = await getAuction(req)

  res.render("general/subasta", {
    artista: auction.artista ,
    cliente: auction.cliente,
    myArray: auction.myArray,
    logueado: auction.logueado,
    admin: auction.logueado,
    subasta: auction.subasta,
    fotos: auction.fotos,
    nombre: auction.nombre[0],
  });
});

router.get("/subastas", async (req, res) => {
  const auctions = await getAuctions(req)

  res.render("general/subastas", {
    artista: auctions.artista,
    cliente: auctions.cliente,
    logueado: auctions.logueado,
    admin: auctions.admin,
    nombre: auctions.nombre[0],
    obras: auctions.obras,
  });
});

router.get("/evento/:id", async (req, res) => {
  const event = await getEvent(req)
  res.render("general/evento", {
    evento: event.evento[0],
    fotos: event.fotos,
    artista: event.artista,
    cliente: event.cliente,
    admin: event.admin,
    logueado: event.logueado,
    nombre: event.nombre[0],
  });
});

router.get("/eventos", async (req, res) => {
  const events = await getEvents(req)
  res.render("general/eventos", {
    eventos: events.eventos,
    artista: events.artista,
    cliente: events.cliente,
    admin: events.admin,
    logueado: events.logueado,
    nombre: events.nombre[0],
  });
});

module.exports = router;
