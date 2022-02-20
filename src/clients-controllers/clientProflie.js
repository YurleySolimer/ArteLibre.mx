const pool = require("../database");
const { getClientCompleted } = require("../services-mysql/clients");
const { getUserName } = require("../services-mysql/users");

var clientProfile = async (data) => {
  const nombre = await getUserName(data.user.id)
  const cliente = true;
  const logueado = true;
  const clienteCompleto = await getClientCompleted(data.user.id)

  return {
    nombre,
    cliente,
    logueado,
    clienteCompleto
  };
};

module.exports = clientProfile;
