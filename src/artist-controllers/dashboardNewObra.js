const pool = require("../database");

var dashboardNewObra = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  const artista = true;
  const logueado = true;
  const dashboard = true;

  const artistainfo =
    ("SELECT id FROM artistas WHERE user_id =?", [data.user.id]);
  console.log(artistainfo);

  const colecciones = await pool.query(
    "SELECT nombreColeccion, id from colecciones WHERE artista_id =?",
    [artistainfo[0]]
  );

  return {
      nombre,
      artista,
      logueado,
      dashboard,
      colecciones
  }
};

module.exports = dashboardNewObra;
