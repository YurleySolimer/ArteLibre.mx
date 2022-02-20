const pool = require("../database");

var getAuctions = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  var obras = await pool.query("SELECT * FROM obraSubasta");
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    obras,
  };
};

module.exports = getAuctions;
