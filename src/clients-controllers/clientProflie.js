const pool = require("../database");

var clientProfile = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const cliente = true;
  const logueado = true;
  const clienteCompleto = await pool.query(
    "SELECT * from usuarioCliente WHERE id =?",
    [data.user.id]
  );

  return {
    nombre,
    cliente,
    logueado,
    clienteCompleto
  };
};

module.exports = clientProfile;
