const pool = require("../database");

var dashboardAuction = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const artista = true;
  const logueado = true;
  const dashboard = true;
  const obras = await pool.query(
    "SELECT * FROM obraSubasta WHERE artista_id=?",
    [data.user.id]
  );

  return {
      nombre,
      artista,
      logueado,
      dashboard,
      obras
  }
};
module.exports = dashboardAuction;
