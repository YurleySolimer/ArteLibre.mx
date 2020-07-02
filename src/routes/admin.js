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


router.get('/admin/artistas', (req, res) => {
    res.render('admin/artistas');
});
router.get('/admin/obras', (req, res) => {
    res.render('admin/obras');
});
router.get('/admin/colecciones', (req, res) => {
    res.render('admin/colecciones');
});
router.get('/admin/dashboard', (req, res) => {
    res.render('admin/dashboard');
});
router.get('/admin/tasas', (req, res) => {
    res.render('admin/tasas');
});
router.get('/admin/rendimiento', (req, res) => {
    res.render('admin/rendimiento');
});
router.get('/admin/subastas', (req, res) => {
    res.render('admin/subastas');
});
router.get('/admin/clientes', (req, res) => {
    res.render('admin/clientes');
});
router.get('/admin/eventos', (req, res) => {
    res.render('admin/eventos');
});
router.get('/admin/ventas', (req, res) => {
    res.render('admin/ventas');
});

module.exports = router;