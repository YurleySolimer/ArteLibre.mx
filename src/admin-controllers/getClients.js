const { getAllClients } = require("../services-mysql/clients");
const { getUserName } = require("../services-mysql/users");

var getClients = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = true;
      const logueado = true;
      const nombre = await getUserName(data.user.id);

      var clientesCompletos = await getAllClients();
      return resolve({
        nombre,
        admin,
        logueado,
        dashboard,
        clientesCompletos,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getClients;
