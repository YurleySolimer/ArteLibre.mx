const { getAllClients } = require("../services-mysql/clients");
const { getUserName } = require("../services-mysql/users");

var getClients = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await getUserName(data.user.id)

  var clientesCompletos = await getAllClients()
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    clientesCompletos,
  };
};

module.exports = getClients;
