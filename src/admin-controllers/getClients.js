const pool = require("../database");

var getClients = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  var clientesCompletos = await pool.query("SELECT * FROM usuarioCliente");
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    clientesCompletos,
  };
};

module.exports = getClients;
