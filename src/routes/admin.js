const express = require('express');
const router = express.Router();
const pool = require('../database');

const Handlebars = require('handlebars');

Handlebars.registerHelper('año', function(date) {
  const año = date.getFullYear();  
  return año;
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if(v1 === v2) {
	  return options.fn(this);
	}
	return options.inverse(this);
  });


router.get('/admin-artistas', (req, res) => {
    res.render('admin/artistas');
});
router.get('/admin-obras', (req, res) => {
    res.render('admin/obras');
});
router.get('/admin-colecciones', (req, res) => {
    res.render('admin/colecciones');
});

module.exports = router;