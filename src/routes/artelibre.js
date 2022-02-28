const express = require("express");
const Handlebars = require("handlebars");

const router = express.Router();

const handleError = require("../handlers/handleErrors");

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

router.get("/coleccion/:id", async (req, res) => {
  try {
    const collection = await getCollection(req);
    res.render("general/coleccion", collection);
  } catch (err) {
    console.error("GET-COLECCION", err);
    return handleError(
      {
        status: 500,
        message: "Error al la coleccion",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/registro", async (req, res) => {
  try {
    const signUp = await getSignUp(req);
    res.render("general/registro", signUp);
  } catch (err) {
    console.error("GET-SIGNUP", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener el registro",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/colecciones", async (req, res) => {
  try {
    const collections = await getCollections(req);
    res.render("general/colecciones", collections);
  } catch (err) {
    console.error("GET-COLLECTIONS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener las colecciones",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/obra/:id", async (req, res) => {
  try {
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
          obra,
          uStripe,
        });
      } else {
        res.render("general/obra", {
          obra,
          session_id: sessionS.session_id,
          uStripe,
        });
      }
    } else {
      res.render("general/obra",
        obra,
      );
    }
  } catch (err) {
    console.error("GET-OBRA", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener la obra",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/obra/success/:id", async (req, res) => {
  try {
    const obra = await getObraSuccess(req);
    const id = req.params.id;
    if (obra) {
      req.flash("success", "Felicidades, ha comprado la obra exitosamente");
      res.redirect(`/obra/${id}`);
    } else {
      res.redirect(`/obra/${id}`);
    }
  } catch (err) {
    console.error("GET-OBRA", err);
    return handleError(
      {
        status: 500,
        message: "Error al comprar la obra",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/artista/:id", async (req, res) => {
  try {
    const artist = await getArtist(req);
    res.render("general/artista", artist);
  } catch (err) {
    console.error("GET-ARTIST", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener artista",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/artista/:id/galeria", async (req, res) => {
  try {
    const artist = await getArtistGallery(req);
    res.render("artist/galeria", artist);
  } catch (err) {
    console.error("GET-ARTIST-GALLERY", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener la galería",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/artistas", async (req, res) => {
  try {
    const artists = await getArtists(req);
    res.render("general/artistas", artists);
  } catch (err) {
    console.error("GET-ARTISTS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener a los artistas",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/obras", async (req, res) => {
  try {
    const obras = await getObras(req);
    res.render("general/obras", obras);
  } catch (err) {
    console.error("GET-OBRAS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener las obras",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/subasta/:id", async (req, res) => {
  try {
    const auction = await getAuction(req);
    res.render("general/subasta", auction);
  } catch (err) {
    console.error("GET-AUCTION", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener la subasta",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/subastas", async (req, res) => {
  try {
    const auctions = await getAuctions(req);
    res.render("general/subastas", auctions);
  } catch (err) {
    console.error("GET-AUCTIONS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener las subastas",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/evento/:id", async (req, res) => {
  try {
    const event = await getEvent(req);
    res.render("general/evento", event);
  } catch (err) {
    console.error("GET-EVENT", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener el evento",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/eventos", async (req, res) => {
  try {
    const events = await getEvents(req);
    res.render("general/eventos", events);
  } catch (err) {
    console.error("GET-EVENTS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener los eventos",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

module.exports = router;
