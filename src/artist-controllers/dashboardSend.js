const { updateClientShop } = require("../services-mysql/clients");

var dashboardSend = async (data) => {
    const codigo = data.body.codigo;
    const id = data.body.id;
    const newCodigo = {
      codigo,
      estadoObra: "Enviado",
    };
    await updateClientShop(newCodigo, id)
    return true
};
module.exports = dashboardSend;
