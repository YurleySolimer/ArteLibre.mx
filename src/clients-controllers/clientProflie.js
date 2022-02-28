const pool = require("../database");
const { getClientCompleted } = require("../services-mysql/clients");
const { getUserName } = require("../services-mysql/users");

var clientProfile = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const clienteCompleto = await getClientCompleted(data.user.id);
      const cliente = true;
      const logueado = true;
      console.log(nombre)

      return resolve({
        nombre,
        cliente,
        logueado,
        clienteCompleto,
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = clientProfile;
