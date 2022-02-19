const pool = require("../database");

var clientHistory = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const cliente = true;
  const logueado = true;
  const obras = await pool.query(
    "SELECT * from obraComprada WHERE id_user =?",
    [data.user.id]
  );

  return {
    nombre,
    cliente,
    logueado,
    obras,
  };
};

module.exports = clientHistory;
