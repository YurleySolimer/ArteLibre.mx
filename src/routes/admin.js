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
  try {
    var artists = await getArtists(req);
    res.render("admin/artistas", artists);
  } catch (err) {
    console.error("ADMIN-GET-ARTISTS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener artistas.",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post(
  "/admin/artistas/destacar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const artists = await featureArtists(req);
      res.redirect("/admin/artistas");
    } catch (err) {
      console.error("ADMIN-ARTISTS-FEATURE", err);
      return handleError(
        {
          status: 500,
          message: "Error al destacar artistas.",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.post(
  "/admin/artistas/suspender/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const artists = await suspendArtists(req);
      res.redirect("/admin/artistas");
    } catch (err) {
      console.error("ADMIN-ARTISTS-SUSPEND", err);
      return handleError(
        {
          status: 500,
          message: "Error al suspender artistas.",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get("/admin/obras", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const obras = await getObras(req);
    res.render("admin/obras", obras);
  } catch (err) {
    console.error("ADMIN-GET-OBRAS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener obras.",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get(
  "/admin/obras/ocultar/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const obras = await hideObras(req);
      res.redirect("/admin/obras");
    } catch (err) {
      console.error("ADMIN-OBRAS-HIDE", err);
      return handleError(
        {
          status: 500,
          message: "Error al ocultar obras.",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.post("/admin/obras/destacar", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const obras = await featureObras(req);
    res.redirect("/admin/obras");
  } catch (err) {
    console.error("ADMIN-OBRAS-FEATURE", err);
    return handleError(
      {
        status: 500,
        message: "Error al destacar obras.",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post(
  "/admin/obras/recomendar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const obras = await recommendObras(req);
      res.redirect("/admin/obras");
    } catch (err) {
      console.error("ADMIN-OBRAS-RECOMMEND", err);
      return handleError(
        {
          status: 500,
          message: "Error al recomendar obras.",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get("/admin/colecciones", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const collections = await getCollections(req);
    res.render("admin/colecciones", collections);
  } catch (err) {
    console.error("ADMIN-GET-COLLECTIONS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener colecciones",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post(
  "/admin/colecciones/destacar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const collections = await featureCollections(req);
      res.redirect("/admin/colecciones");
    } catch (err) {
      console.error("ADMIN-GET-COLLECTIONS-FEATURE", err);
      return handleError(
        {
          status: 500,
          message: "Error al destacar colecciones",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get(
  "/admin/colecciones/ocultar/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const collections = await hideCollections(req);
      res.redirect("/admin/colecciones");
    } catch (err) {
      console.error("ADMIN-GET-COLLECTIONS-HIDE", err);
      return handleError(
        {
          status: 500,
          message: "Error al ocultar colecciones",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get("/admin/dashboard", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const dashboard = await getDashboard(req);
    res.render("admin/dashboard", dashboard);
  } catch (err) {
    console.error("ADMIN-GET-DASHBOARD", err);
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
router.get("/admin/tasas", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const rates = await getRates(req);
    res.render("admin/tasas", rates);
  } catch (err) {
    console.error("ADMIN-GET-RATES", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener las tasas",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});
router.get("/admin/rendimiento", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const performance = await getPerformance(req);
    res.render("admin/rendimiento", performance);
  } catch (err) {
    console.error("ADMIN-GET-PERFORMANCE", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener el rendimiento",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});
router.get("/admin/subastas", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const auctions = await getAuctions(req);
    res.render("admin/subastas", auctions);
  } catch (err) {
    console.error("ADMIN-GET-AUCTIONS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener subastas",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.post(
  "/admin/subastas/publicar",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const auctions = await publicAuctions(req);
      res.redirect("/admin/subastas");
    } catch (err) {
      console.error("ADMIN-PUBLIC-AUCTIONS", err);
      return handleError(
        {
          status: 500,
          message: "Error al publicar subastas",
          errorDetail: err.message,
        },
        {},
        res
      );
    }
  }
);

router.get("/admin/clientes", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const clients = await getClients(req);
    res.render("admin/clientes", clients);
  } catch (err) {
    console.error("ADMIN-GET-CLIENTS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener clientes",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});
router.get("/admin/eventos", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const events = await getEvents(req);
    res.render("admin/eventos", events);
  } catch (err) {
    console.error("ADMIN-GET-EVENTS", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener eventos",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});
router.get("/admin/ventas", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const sales = await getSales(req);
    res.render("admin/ventas", sales);
  } catch (err) {
    console.error("ADMIN-GET-SALES", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener ventas",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

module.exports = router;
