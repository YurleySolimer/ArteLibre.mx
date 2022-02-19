const pool = require("../database");

var dashboardObras = async (data) => {
  const artista = true;
  const logueado = true;
  const dashboard = true;

  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE artista_id =?",
    [data.user.id]
  );
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  return {
    artista,
    logueado,
    dashboard,
    nombre,
    obras,
  };
};

module.exports = dashboardObras;
