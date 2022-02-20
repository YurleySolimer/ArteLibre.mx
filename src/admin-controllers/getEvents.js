const pool = require("../database");

var getEvents = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const eventos = await pool.query("SELECT * FROM eventoCompleto");

  return {
    nombre: nombre[0],
    admin,
    logueado,
    dashboard,
    eventos,
  };
};

module.exports = getEvents;
