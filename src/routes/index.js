const Handlebars = require("handlebars");
const express = require("express");
const router = express.Router();

const getIndex = require("../index-controllers/getIndex");
const handleError = require("../handlers/handleErrors");

Handlebars.registerHelper("fecha", function (date) {
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();
  return `${dia} - ${mes} - ${año}`;
});

router.get("/", async (req, res) => {
  try {
    const index = await getIndex(req);
    res.render("index", index);
  } catch (err) {
    console.error('GET-INDEX', err);
      return handleError({ 
        status: 500, 
        message: "Error al obtener la pagina de inicio.",
        errorDetail: err.message,
      }, {}, res);
  }
});

module.exports = router;
