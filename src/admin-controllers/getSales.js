const pool = require("../database");

var getSales = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  return { nombre, admin, logueado, dashboard };
};

module.exports = getSales;
