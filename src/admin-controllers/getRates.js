const pool = require("../database");

var getRates = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  return {
    nombre,
    logueado,
    dashboard,
    admin
  };
};

module.exports = getRates;
