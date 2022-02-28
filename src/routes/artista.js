const express = require("express");
const Handlebars = require("handlebars");

const router = express.Router();

const handleError = require("../handlers/handleErrors");

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

var dashboard = false;

Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get("/connect/oauth", isLoggedIn, isArtista, async (req, res) => {
  try {
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
  } catch (err) {
    console.error("GET-STRIPE-AUTH", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener el código de stripe.",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

// Dashboard
router.get("/dashboard", isLoggedIn, isArtista, async (req, res) => {
  try {
    const artistDashboardResult = await artistDashboard(req);
    res.render("artist/dashboard", artistDashboardResult);
  } catch (err) {
    console.error("GET-DASHBOARD", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener el dashboard",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/dashboard/ventas", isLoggedIn, isArtista, async (req, res) => {
  try {
    const dashboardResult = await dashboardSales(req);
    res.render("artist/mis-ventas", dashboardResult);
  } catch (err) {
    console.error("GET-DASHBOARD-SALES", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener tus ventas",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post(
  "/dashboard/ventas/envio",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const codigo = await dashboardSend(req);
      req.flash("success", "Obra enviada");
      res.redirect("/dashboard/ventas");
    } catch (err) {
      console.error("GET-DASHBOARD-SEND", err);
      return handleError(
        {
          status: 500,
          message: "Error en el envio",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get("/dashboard/eventos", isLoggedIn, isArtista, async (req, res) => {
  try {
    const events = await dashboardEvents(req);
    res.render("artist/mis-eventos", events);
  } catch (err) {
    console.error("GET-DASHBOARD-EVENTS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener tus eventos",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/dashboard/subastas", isLoggedIn, isArtista, async (req, res) => {
  try {
    const auction = await dashboardAuction(req);
    res.render("artist/mis-subastas", auction);
  } catch (err) {
    console.error("GET-DASHBOARD-AUCTIONS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener tus subastas",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get(
  "/dashboard/colecciones",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const collections = await dashboardCollections(req);
      res.render("artist/mis-colecciones", collections);
    } catch (err) {
      console.error("GET-DASHBOARD-COLLECTIONS", err);
      return handleError(
        {
          status: 500,
          message: "Error al obtener tus colecciones",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get(
  "/dashboard/rendimiento",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const stats = await dashboardStats(req);
      res.render("artist/mi-rendimiento", stats);
    } catch (err) {
      console.error("GET-DASHBOARD-STATS", err);
      return handleError(
        {
          status: 500,
          message: "Error al obtener tu rendimientos",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get("/dashboard/obras", isLoggedIn, isArtista, async (req, res) => {
  try {
    const obras = await dashboardObras(req);
    res.render("artist/mis-obras", obras);
  } catch (err) {
    console.error("GET-DASHBOARD-OBRAS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener tus obras",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get(
  "/dashboard/obras/quitarGaleria/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const gallery = await dashboardNoGallery(req);
      req.flash("success", "La no se mostrará en tu galería");
      res.redirect("/dashboard/obras");
    } catch (err) {
      console.error("GET-DASHBOARD-NO-GALLERY", err);
      return handleError(
        {
          status: 500,
          message: "Error al quitar obra de tu galeria",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get(
  "/dashboard/obras/mostrarGaleria/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const gallery = await dashboardYesGallery(req);
      req.flash("success", "La obra será mostrada en tu galería");
      res.redirect("/dashboard/obras");
    } catch (err) {
      console.error("GET-DASHBOARD-YES-GALLERY", err);
      return handleError(
        {
          status: 500,
          message: "Error al mostrar obra en tu galeria",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get(
  "/dashboard/obras/ocultar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const hide = await dashboardObrasHide(req);
      req.flash("success", "La obra ha sido oculta");
      res.redirect("/dashboard/obras");
    } catch (err) {
      console.error("GET-DASHBOARD-HIDE-OBRA", err);
      return handleError(
        {
          status: 500,
          message: "Error al ocultar obra",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get(
  "/dashboard/obras/mostrar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const show = await dashboardObrasShow(req);
      req.flash("success", "La obra será mostrada");
      res.redirect("/dashboard/obras");
    } catch (err) {
      console.error("GET-DASHBOARD-SHOW-OBRA", err);
      return handleError(
        {
          status: 500,
          message: "Error al mostrar obra",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get(
  "/dashboard/obras/eliminar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const deleted = await dashboardObrasDelete(req);
      req.flash("success", "La obra ha sido eliminada");
      res.redirect("/dashboard/obras");
    } catch (err) {
      console.error("GET-DASHBOARD-DELETE-OBRA", err);
      return handleError(
        {
          status: 500,
          message: "Error al eliminar obra",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get(
  "/dashboard/eventos/eliminar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const deleted = await dashboardEventsDelete(req);
      req.flash("success", "El evento ha sido eliminado");
      res.redirect("/dashboard/eventos");
    } catch (err) {
      console.error("GET-DASHBOARD-DELETE-EVENT", err);
      return handleError(
        {
          status: 500,
          message: "Error al eliminar evento",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
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
    try {
      const newEvent = await getNewEvent(req);
      dashboard = true;
      res.render("artist/dashboard-nuevo-evento", newEvent);
    } catch (err) {
      console.error("GET-DASHBOARD-CREATE-EVENT", err);
      return handleError(
        {
          status: 500,
          message: "Error al crear nuevo evento",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get("/dashboard/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  try {
    const newObra = await getNewObra(req);
    dashboard = true;
    res.render("artist/dashboard-nueva-obra", newObra);
  } catch (err) {
    console.error("GET-DASHBOARD-CREATE-OBRA", err);
    return handleError(
      {
        status: 500,
        message: "Error al crear nueva obra",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get(
  "/dashboard/nueva-coleccion",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const newCollection = await getNewCollection(req);
      dashboard = true;
      res.render("artist/dashboard-nueva-coleccion", newCollection);
    } catch (err) {
      console.error("GET-DASHBOARD-CREATE-COLLECTION", err);
      return handleError(
        {
          status: 500,
          message: "Error al crear nueva colección",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

//
// Nuevos elementos por fuera del dashboard GET
//

router.get("/nuevo-evento", isLoggedIn, isArtista, async (req, res) => {
  try {
    const newEvent = await getNewEvent(req);
    dashboard = false;
    res.render("artist/nuevo-evento", newEvent);
  } catch (err) {
    console.error("GET-DASHBOARD-GET-NEW-EVENT", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener nuevo evento",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  try {
    const newObra = await getNewObra(req);
    dashboard = false;
    res.render("artist/nueva-obra", newObra);
  } catch (err) {
    console.error("GET-DASHBOARD-GET-NEW-OBRA", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener nueva obra",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/nueva-coleccion", isLoggedIn, isArtista, async (req, res) => {
  try {
    const newCollection = await getNewCollection(req);
    dashboard = false;
    res.render("artist/nueva-coleccion", newCollection);
  } catch (err) {
    console.error("GET-DASHBOARD-GET-NEW-COLLECTION", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener nueva colección",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

//
// Nuevos elementos POST
//

router.post("/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  try {
    const saveObra = await saveNewObra(req);
    if (dashboard) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard/obras");
    }
  } catch (err) {
    console.error("GET-DASHBOARD-SAVE-NEW-OBRA", err);
    return handleError(
      {
        status: 500,
        message: "Error al guardar nueva obra",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post("/nueva-coleccion", isLoggedIn, isArtista, async (req, res) => {
  try {
    const newCollection = await saveNewCollection(req);
    if (dashboard) {
      res.redirect("/dashboard/nueva-obra");
    } else {
      res.redirect("nueva-obra");
    }
  } catch (err) {
    console.error("GET-DASHBOARD-SAVE-NEW-COLLECTION", err);
    return handleError(
      {
        status: 500,
        message: "Error al guardar nueva colección",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post("/nuevo-evento", isLoggedIn, isArtista, async (req, res) => {
  try {
    const newEvent = await saveNewEvent(req);
    if (dashboard) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard/eventos");
    }
  } catch (err) {
    console.error("GET-DASHBOARD-SAVE-NEW-EVENT", err);
    return handleError(
      {
        status: 500,
        message: "Error al guardar nuevo evento",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post(
  "/dashboard/eventos/editar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    try {
      const eventUpdated = await editEvent(req);
      req.flash("success", "Evento actualizado");
      res.redirect("/dashboard/eventos");
    } catch (err) {
      console.error("GET-DASHBOARD-EDIT-EVENT", err);
      return handleError(
        {
          status: 500,
          message: "Error al editar evento",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.post("/obra/editar/:id", isLoggedIn, isArtista, async (req, res) => {
  try {
    const obraUpdated = await editObra(req);
    const { id } = req.body;
    res.redirect("/obra/" + id);
  } catch (err) {
    console.error("GET-DASHBOARD-EDIT-OBRA", err);
    return handleError(
      {
        status: 500,
        message: "Error al editar obra",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

//
// Perfil
//

router.get("/artist-perfil", isLoggedIn, isArtista, async (req, res) => {
  try {
    const profile = await artistProfile(req);
    dashboard = false;
    res.render("artist/perfil", profile);
  } catch (err) {
    console.error("GET-ARTIST-PROFILE", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener perfil",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post("/editar-Artista", isLoggedIn, isArtista, async (req, res) => {
  try {
    const edit = await editProfile(req);
    res.redirect("/artist-perfil");
  } catch (err) {
    console.error("GET-ARTIST-EDIT-PROFILE", err);
    return handleError(
      {
        status: 500,
        message: "Error al editar perfil",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

module.exports = router;
