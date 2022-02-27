const express = require("express");
const Handlebars = require("handlebars");

const router = express.Router();

const { isCliente } = require("../lib/auth");
const { isLoggedIn } = require("../lib/auth");

const clientPurchase = require("../clients-controllers/clientPurchases");
const clientProfile = require("../clients-controllers/clientProflie");
const clientHistory = require("../clients-controllers/clientHistory");

const handleError = require("../handlers/handleErrors");

Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get("/cliente/compras", isLoggedIn, isCliente, async (req, res) => {
  try {
    const purchases = await clientPurchase(req);
    res.render("client/compras", purchases);
  } catch (err) {
    console.error("GET-CLIENT-PURCHASE", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener tus compras.",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/cliente/perfil", isLoggedIn, isCliente, async (req, res) => {
  try {
    const profile = await clientProfile(req);
    console.log(profile)
    res.render("client/perfil", profile);
  } catch (err) {
    console.error("GET-CLIENT-PROFILE", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener tu perfil.",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

router.get("/cliente/historial", isLoggedIn, isCliente, async (req, res) => {
  try {
    const history = await clientHistory(req);
    res.render("client/mis-pedidos", history);
  } catch (err) {
    console.error("GET-CLIENT-HISTORY", err);
    return handleError(
      {
        status: 500,
        message: "Error al obtener tu historial de compras.",
        errorDetail: err.message,
      },
      {},
      res
    );
  }
});

module.exports = router;
