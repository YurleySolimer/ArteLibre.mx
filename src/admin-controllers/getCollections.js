const pool = require("../database");

var getCollections = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  const colecciones = await pool.query("SELECT * from coleccionArtista");
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    colecciones,
  };
};

module.exports = getCollections;
