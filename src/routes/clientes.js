const express = require("express");
const Handlebars = require("handlebars");

const router = express.Router();

const { isCliente } = require("../lib/auth");
const { isLoggedIn } = require("../lib/auth");

const clientPurchase = require("../clients-controllers/clientPurchases");
const clientProfile = require("../clients-controllers/clientProflie");
const clientHistory = require("../clients-controllers/clientHistory");

Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get("/cliente/compras", isLoggedIn, isCliente, async (req, res) => {
  const purchases = await clientPurchase(req);
  res.render("client/compras", {
    nombre: purchases.nombre[0],
    cliente: purchases.cliente,
    logueado: purchases.logueado,
    obras: purchases.obras,
  });
});

router.get("/cliente/perfil", isLoggedIn, isCliente, async (req, res) => {
  const profile = await clientProfile(req)
  res.render("client/perfil", {
    nombre: profile.nombre[0],
    cliente: profile.cliente,
    logueado: profile.logueado,
    clienteCompleto: profile.clienteCompleto[0],
  });
});

router.get("/cliente/historial", isLoggedIn, isCliente, async (req, res) => {
  const history = clientHistory(req)
  res.render("client/mis-pedidos", {
    nombre: nombre[0],
    cliente,
    obras,
    logueado,
  });
});

module.exports = router;
