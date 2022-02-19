const pool = require("../database");

var getNewEvent = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const artista = true;
  const logueado = true;

  return {
    nombre,
    artista,
    logueado,
  };
};

module.exports = getNewEvent;
