const { updateClientShop } = require("../services-mysql/clients");

var dashboardSend = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const codigo = data.body.codigo;
      const id = data.body.id;
      const newCodigo = {
        codigo,
        estadoObra: "Enviado",
      };
      await updateClientShop(newCodigo, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = dashboardSend;
