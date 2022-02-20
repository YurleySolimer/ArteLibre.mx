const pool = require("../database");

var getObras = async (data) => {
  const admin = true;
  const logueado = true;
  var obras = await pool.query("SELECT * FROM obraCompleta");
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  return {
    nombre,
    admin,
    logueado,
    dashboard,
    obras,
  };
};

module.exports = getObras;
