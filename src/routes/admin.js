const Handlebars = require("handlebars");
const express = require("express");
const router = express.Router();

const { isAdmin } = require("../lib/auth");
const { isLoggedIn } = require("../lib/auth");
const getArtists = require("../admin-controllers/getArtists");
const featureArtists = require("../admin-controllers/featureArtists");
const suspendArtists = require("../admin-controllers/suspendArtists");
const getObras = require("../admin-controllers/getObras");
const hideObras = require("../admin-controllers/hideObras");
const featureObras = require("../admin-controllers/featureObras");
const recommendObras = require("../admin-controllers/recommendObras");
const getCollections = require("../admin-controllers/getCollections");
const featureCollections = require("../admin-controllers/featureCollections");
const hideCollections = require("../admin-controllers/hideCollections");
const getDashboard = require("../admin-controllers/getDashboard");
const getRates = require("../admin-controllers/getRates");
const getPerformance = require("../admin-controllers/getPerformance");
const getAuctions = require("../admin-controllers/getAuctions");
const publicAuctions = require("../admin-controllers/publicAuction");
const getClients = require("../admin-controllers/getClients");
const getEvents = require("../admin-controllers/getEvents");
const getSales = require("../admin-controllers/getSales");

Handlebars.registerHelper("fecha", function (date) {
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();
  return `${dia} - ${mes} - ${año}`;
});


Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get("/admin/artistas", isLoggedIn, isAdmin, async (req, res) => {
  var artists = await getArtists(req);

  res.render("admin/artistas", {
    nombre: artists.nombre[0],
    admin: artists.admin,
    logueado: artists.logueado,
    dashboard: artists.dashboard,
    artistasCompletos: artists.artistasCompletos,
  });
});

router.post(
  "/admin/artistas/destacar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const artists = await featureArtists(req);
    res.redirect("/admin/artistas");
  }
);

router.post(
  "/admin/artistas/suspender/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const artists = await suspendArtists(req);
    res.redirect("/admin/artistas");
  }
);

router.get("/admin/obras", isLoggedIn, isAdmin, async (req, res) => {
  const obras = await getObras(req);
  res.render("admin/obras", {
    nombre: obras.nombre[0],
    admin: obras.admin,
    logueado: obras.logueado,
    dashboard: obras.dashboard,
    obras: obras.obras,
  });
});

router.get(
  "/admin/obras/ocultar/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const obras = await hideObras(req);
    res.redirect("/admin/obras");
  }
);

router.post("/admin/obras/destacar", isLoggedIn, isAdmin, async (req, res) => {
  const obras = await featureObras(req);
  res.redirect("/admin/obras");
});

router.post(
  "/admin/obras/recomendar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const obras = await recommendObras(req);
    res.redirect("/admin/obras");
  }
);

router.get("/admin/colecciones", isLoggedIn, isAdmin, async (req, res) => {
  const collections = await getCollections(req);
  res.render("admin/colecciones", {
    nombre: collections.nombre[0],
    admin: collections.admin,
    logueado: collections.logueado,
    dashboard: collections.dashboard,
    colecciones: collections.colecciones,
  });
});

router.post(
  "/admin/colecciones/destacar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const collections = await featureCollections(req);
    res.redirect("/admin/colecciones");
  }
);

router.get(
  "/admin/colecciones/ocultar/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const collections = await hideCollections(req);
    res.redirect("/admin/colecciones");
  }
);

router.get("/admin/dashboard", isLoggedIn, isAdmin, async (req, res) => {
  const dashboard = await getDashboard(req);

  res.render("admin/dashboard", {
    nombre: dashboard.nombre[0],
    admin: dashboard.admin,
    transaccionesTotal: dashboard.transaccionesTotal,
    ingresos: dashboard.ingresos,
    eventos: dashboard.eventos,
    proximosEventos: dashboard.proximosEventos,
    artistasRelevantes: dashboard.artistasRelevantes,
    proximasSubastas: dashboard.proximasSubastas,
    ultimaObra: dashboard.ultimaObra[0],
    obraVisitada: dashboard.obraVisitada[0],
    ultimaColeccion: dashboard.ultimaColeccion[0],
    galeria: dashboard.galeria[0],
    logueado: dashboard.logueado,
    dashboard: dashboard.dashboard,
  });
});
router.get("/admin/tasas", isLoggedIn, isAdmin, async (req, res) => {
  const rates = await getRates(req);
  res.render("admin/tasas", {
    nombre: rates.nombre[0],
    admin: rates.admin,
    logueado: rates.logueado,
    dashboard: rates.dashboard,
  });
});
router.get("/admin/rendimiento", isLoggedIn, isAdmin, async (req, res) => {
  const performance = await getPerformance(req);

  res.render("admin/rendimiento", {
    nombre: performance.nombre[0],
    admin: performance.admin,
    precioPromedio: performance.precioPromedio,
    promArtistasObra: performance.promArtistasObra,
    promGanancia: performance.promGanancia,
    logueado: performance.logueado,
    dashboard: performance.dashboard,
    clientesRegion: performance.clientesRegion,
    artistasDestacados: performance.artistasDestacados,
    compradoresTasa: performance.compradoresTasa,
    clientesDestacados: performance.clientesDestacados,
  });
});
router.get("/admin/subastas", isLoggedIn, isAdmin, async (req, res) => {
  const auctions = await getAuctions(req);
  res.render("admin/subastas", {
    nombre: auctions.nombre[0],
    admin: auctions.admin,
    logueado: auctions.logueado,
    dashboard: auctions.dashboard,
    obras: auctions.obras,
  });
});

router.post(
  "/admin/subastas/publicar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const auctions = await publicAuctions(req);
    res.redirect("/admin/subastas");
  }
);

router.get("/admin/clientes", isLoggedIn, isAdmin, async (req, res) => {
  const clients = await getClients(req);
  res.render("admin/clientes", {
    nombre: clients.nombre[0],
    admin: clients.admin,
    logueado: clients.logueado,
    dashboard: clients.dashboard,
    clientesCompletos: clients.clientesCompletos,
  });
});
router.get("/admin/eventos", isLoggedIn, isAdmin, async (req, res) => {
  const events = await getEvents(req);

  res.render("admin/eventos", {
    nombre: events.nombre[0],
    admin: events.admin,
    logueado: events.logueado,
    dashboard: events.dashboard,
    eventos: events.eventos,
  });
});
router.get("/admin/ventas", isLoggedIn, isAdmin, async (req, res) => {
  const sales = await getSales(req);
  res.render("admin/ventas", {
    nombre: sales.nombre[0],
    admin: sales.admin,
    logueado: sales.logueado,
    dashboard: sales.dashboard,
  });
});

module.exports = router;
