const pool = require("../database");

var dashboardSales = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const artista = true;
  const logueado = true;
  const dashboard = true;

  const obras = await pool.query(
    "SELECT * FROM obraComprada WHERE artista_id =?",
    [data.user.id]
  );

  return {
      artista,
      logueado,
      dashboard,
      nombre,
      obras
  }
};
module.exports = dashboardSales;
