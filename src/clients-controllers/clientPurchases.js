const { getClientObras } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var clientPurchase = async (data) => {
  const nombre = await getUserName(data.user.id)
  const cliente = true;
  const logueado = true;
  const obras = await getClientObras(data.user.id)

  return {
      nombre,
      cliente,
      logueado,
      obras
  }
};

module.exports = clientPurchase;
