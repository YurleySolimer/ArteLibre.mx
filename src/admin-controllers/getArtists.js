const pool = require("../database");

var getArtists = async (data) => {
  var artistasCompletos = await pool.query("SELECT * FROM usuarioArtista");

  const admin = true;
  const logueado = true;

  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    artistasCompletos,
  };
};

module.exports = getArtists;
