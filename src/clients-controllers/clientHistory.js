const { getClientObras } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var clientHistory = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const obras = await getClientObras(data.user.id);
      const cliente = true;
      const logueado = true;

      return resolve({
        nombre: nombre[0],
        cliente,
        logueado,
        obras,
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = clientHistory;
