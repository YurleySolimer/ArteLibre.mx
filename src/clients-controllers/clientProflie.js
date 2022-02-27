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

      return resolve({
        nombre: nombre[0],
        cliente,
        logueado,
        clienteCompleto: clienteCompleto[0],
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = clientProfile;
