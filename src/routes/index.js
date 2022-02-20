const Handlebars = require("handlebars");
const express = require("express");
const router = express.Router();

const getIndex = require("../index-controllers/getIndex");

Handlebars.registerHelper("fecha", function (date) {
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();
  return `${dia} - ${mes} - ${año}`;
});

router.get("/", async (req, res) => {
  const index = await getIndex(req);
  res.render("index", {
    artista: index.artista ,
    admin: index.admin,
    nombre: index.nombre[0],
    cliente: index.cliente,
    logueado: index.logueado,
    eventos: index.eventos,
    coleccion_destacada: index.coleccion_destacada[0],
    obras_coleccion: index.obras_coleccion,
    obra_destacada: index.obra_destacada,
    destacadas: index.destacadas,
    obra1_artista: index.obra1_artista,
    obra2_artista: index.obra2_artista,
    artista_destacado: index.artista_destacado,
  });
});

module.exports = router;
