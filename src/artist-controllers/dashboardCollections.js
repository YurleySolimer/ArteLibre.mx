const pool = require("../database");

var dashboardCollection = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const artista = true;
  const logueado = true;
  const dashboard = true;
  const colecciones = await pool.query(
    "SELECT * from coleccionArtista WHERE artista_id =?",
    [data.user.id]
  );

  return {
    nombre,
    artista,
    logueado,
    dashboard,
    colecciones,
  };
};
module.exports = dashboardCollection;
