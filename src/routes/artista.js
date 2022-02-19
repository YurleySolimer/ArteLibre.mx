const express = require("express");
const router = express.Router();
const pool = require("../database");


var dashboard = false;

const Handlebars = require("handlebars");

const { isArtista } = require("../lib/auth");
const { isLoggedIn } = require("../lib/auth");

const stripeAuth = require("../artist-controllers/stripeAuth");
const artistDashboard = require("../artist-controllers/artistDashboard");
const dashboardSales = require("../artist-controllers/dashboardSales");
const dashboardSend = require("../artist-controllers/dashboardSend");
const dashboardEvents = require("../artist-controllers/dashboardEvents");
const dashboardAuction = require("../artist-controllers/dashboardAuction");
const dashboardCollections = require("../artist-controllers/dashboardCollections");

const dashboardStats = require("../artist-controllers/dashboardStats");
const dashboardObras = require("../artist-controllers/dashboardObras");
const dashboardNoGallery = require("../artist-controllers/dashboardNoGallery");
const dashboardYesGallery = require("../artist-controllers/dashboardYesGallery");
const dashboardObrasHide = require("../artist-controllers/dashboardObrasHide");
const dashboardObrasShow = require("../artist-controllers/dashboardObrasShow");
const dashboardObrasDelete = require("../artist-controllers/dashboardObrasDelete");
const dashboardEventsDelete = require("../artist-controllers/dashboardEventsDelete");
const getNewEvent = require("../artist-controllers/getNewEvent");
const getNewObra = require("../artist-controllers/getNewObra");
const getNewCollection = require("../artist-controllers/getNewCollection");
const saveNewObra = require("../artist-controllers/saveNewObra");
const saveNewCollection = require("../artist-controllers/saveNewCollection");
const saveNewEvent = require("../artist-controllers/saveNewEvent");
const editEvent = require("../artist-controllers/editEvent");
const editObra = require("../artist-controllers/editObra");
const artistProfile = require("../artist-controllers/artistProfile");
const editProfile = require("../artist-controllers/editProfile");

Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get("/connect/oauth", isLoggedIn, isArtista, async (req, res) => {
  const data = req.query;
  const stripeAuthResult = await stripeAuth(data);
  if (stripeAuthResult === true) {
    req.flash("success", "Registro Exitoso");
    res.redirect("/dashboard/rendimiento");
  } else {
    if (stripeAuthResult.type === "StripeInvalidGrantError") {
      return res
        .status(400)
        .json({ error: "Invalid authorization code: " + code });
    } else {
      return res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

// Dashboard
router.get("/dashboard", isLoggedIn, isArtista, async (req, res) => {
  const artistDashboardResult = await artistDashboard(req);
  res.render("artist/dashboard", {
    nombre: artistDashboardResult.nombre[0],
    artista: artistDashboardResult.artista,
    logueado: artistDashboardResult.logueado,
    dashboard: artistDashboardResult.dashboard,
    obras: artistDashboardResult.obras,
    colecciones: artistDashboardResult.colecciones,
    ultima_obra: artistDashboardResult.ultima_obra,
    evento: artistDashboardResult.evento,
    subasta: artistDashboardResult.subasta,
    visitas: artistDashboardResult.visitas,
  });
});

router.get("/dashboard/ventas", isLoggedIn, isArtista, async (req, res) => {
  const dashboardResult = await dashboardSales(req);
  res.render("artist/mis-ventas", {
    nombre: dashboardResult.nombre[0],
    artista: dashboardResult.artista,
    logueado: dashboardResult.logueado,
    dashboard: dashboardResult.dashboard,
    obras: dashboardResult.obras,
  });
});

router.post(
  "/dashboard/ventas/envio",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const codigo = await dashboardSend(req);
    req.flash("success", "Obra enviada");
    res.redirect("/dashboard/ventas");
  }
);

router.get("/dashboard/eventos", isLoggedIn, isArtista, async (req, res) => {
  const events = await dashboardEvents(req);
  res.render("artist/mis-eventos", {
    nombre: events.nombre[0],
    artista: events.artist,
    logueado: events.logueado,
    dashboard: events.dashboard,
    eventos: events.eventos,
  });
});

router.get("/dashboard/subastas", isLoggedIn, isArtista, async (req, res) => {
  const auction = await dashboardAuction(req);
  res.render("artist/mis-subastas", {
    nombre: auction.nombre[0],
    artista: auction.artista,
    logueado: auction.logueado,
    dashboard: auction.dashboard,
    obras: auction.obras,
  });
});

router.get(
  "/dashboard/colecciones",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const collections = await dashboardCollections(req);
    res.render("artist/mis-colecciones", {
      nombre: collections.nombre[0],
      artista: collections.artista,
      logueado: collections.logueado,
      dashboard: collections.dashboard,
      colecciones: collections.colecciones,
    });
  }
);

router.get(
  "/dashboard/rendimiento",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const stats = await dashboardStats(req);

    res.render("artist/mi-rendimiento", {
      nombre: stats.nombre[0],
      totalVisitasPerfil: stats.totalVisitasPerfil,
      totalVisitasGaleria: stats.totalVisitasGaleria,
      estaSemana: stats.estaSemana,
      estaSemanaPerfil: stats.estaSemanaPerfil,
      estaSemanaGaleria: stats.estaSemanaGaleria,
      totalVisitasEventos: stats.totalVisitasEventos,
      visitasEvento: stats.visitasEvento,
      colecciones: stats.colecciones,
      semanaPasada: stats.semanaPasada,
      semanaPasadaPerfil: stats.semanaPasadaPerfil,
      semanaPasadaGaleria: stats.semanaPasadaGaleria,
      ventasSemana: stats.ventasSemana,
      ventasMes: stats.ventasMes,
      conversionVisitas: stats.conversionVisitas,
      artista: stats.artista,
      logueado: stats.logueado,
      email: stats.email,
      url: stats.url,
      dashboard: stats.dashboard,
      stripeRegistro: stats.stripeRegistro,
    });
  }
);

router.get("/dashboard/obras", isLoggedIn, isArtista, async (req, res) => {
  const obras = await dashboardObras(req);

  res.render("artist/mis-obras", {
    obras: obras.obras,
    nombre: obras.nombre[0],
    artista: obras.artista,
    logueado: obras.logu,
    dashboard: obras.dashboard,
  });
});

router.get(
  "/dashboard/obras/quitarGaleria/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const gallery = await dashboardNoGallery(req);
    req.flash("success", "La no se mostrará en tu galería");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/mostrarGaleria/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const gallery = await dashboardYesGallery(req);
    req.flash("success", "La obra será mostrada en tu galería");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/ocultar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const hide = await dashboardObrasHide(req);
    req.flash("success", "La obra ha sido oculta");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/mostrar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const show = await dashboardObrasShow(req);
    req.flash("success", "La obra será mostrada");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/eliminar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const deleted = await dashboardObrasDelete(req);
    req.flash("success", "La obra ha sido eliminada");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/eventos/eliminar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const deleted = await dashboardEventsDelete(req);
    req.flash("success", "El evento ha sido eliminado");
    res.redirect("/dashboard/eventos");
  }
);

//
// Dashboard nuevos elementos GET
//

router.get(
  "/dashboard/nuevo-evento",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const newEvent = await getNewEvent(req);
    dashboard = true;

    res.render("artist/dashboard-nuevo-evento", {
      nombre: newEvent.nombre[0],
      artista: newEvent.artista,
      logueado: newEvent.logueado,
      dashboard,
    });
  }
);

router.get("/dashboard/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  const newObra = await getNewObra(req);
  dashboard = true;
  res.render("artist/dashboard-nueva-obra", {
    nombre: newObra.nombre[0],
    colecciones: newObra.colecciones,
    artista: newObra.artista,
    logueado: newObra.logueado,
    dashboard,
  });
});

router.get(
  "/dashboard/nueva-coleccion",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const newCollection = await getNewCollection(req);
    dashboard = true;

    res.render("artist/dashboard-nueva-coleccion", {
      nombre: newCollection.nombre[0],
      artista: newCollection.artista,
      logueado: newCollection.logueado,
      dashboard,
    });
  }
);

//
// Nuevos elementos por fuera del dashboard GET
//

router.get("/nuevo-evento", isLoggedIn, isArtista, async (req, res) => {
  const newEvent = await getNewEvent(req);
  dashboard = false;
  res.render("artist/nuevo-evento", {
    nombre: newEvent.nombre[0],
    artista: newEvent.artista,
    logueado: newEvent.logueado,
    dashboard,
  });
});

router.get("/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  const newObra = await getNewObra(req);
  dashboard = false;
  res.render("artist/nueva-obra", {
    nombre: newObra.nombre[0],
    colecciones: newObra.colecciones,
    artista: newObra.artista,
    logueado: newObra.logueado,
    dashboard,
  });
});

router.get("/nueva-coleccion", isLoggedIn, isArtista, async (req, res) => {
  const newCollection = await getNewCollection(req);
  dashboard = false;
  res.render("artist/nueva-coleccion", {
    nombre: newCollection.nombre[0],
    artista: newCollection.artista,
    logueado: newCollection.logueado,
    dashboard,
  });
});

//
// Nuevos elementos POST
//

router.post("/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  const saveObra = await saveNewObra(req);
  if (dashboard) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/dashboard/obras");
  }
});

router.post("/nueva-coleccion", isLoggedIn, isArtista, async (req, res) => {
  const newCollection = await saveNewCollection(req);
  if (dashboard) {
    res.redirect("/dashboard/nueva-obra");
  } else {
    res.redirect("nueva-obra");
  }
});

router.post("/nuevo-evento", isLoggedIn, isArtista, async (req, res) => {
  const newEvent = await saveNewEvent(req);
  if (dashboard) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/dashboard/eventos");
  }
});

router.post(
  "/dashboard/eventos/editar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const eventUpdated = await editEvent(req);
    req.flash("success", "Evento actualizado");
    res.redirect("/dashboard/eventos");
  }
);

router.post("/obra/editar/:id", isLoggedIn, isArtista, async (req, res) => {
  const obraUpdated = await editObra(req);
  const { id } = req.body;
  res.redirect("/obra/" + id);
});

//
// Perfil
//

router.get("/artist-perfil", isLoggedIn, isArtista, async (req, res) => {
  const profile = await artistProfile(req);
  dashboard = false;
  res.render("artist/perfil", {
    nombre: profile.nombre[0],
    user: profile.user[0],
    obras: profile.obras,
    ultima_obra: profile.ultima_obra,
    artista: profile.artista,
    logueado: profile.logueado,
    dashboard,
  });
});

router.post("/editar-Artista", isLoggedIn, isArtista, async (req, res) => {
  const edit = await editProfile(req)
  res.redirect("/artist-perfil");
});

module.exports = router;
