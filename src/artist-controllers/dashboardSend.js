const pool = require("../database");

var dashboardSend = async (data) => {
    const codigo = data.body.codigo;
    const id = data.body.id;
    const newCodigo = {
      codigo,
      estadoObra: "Enviado",
    };
    await pool.query("UPDATE clienteCompra SET? WHERE id =?", [newCodigo, id]);
    return true
};
module.exports = dashboardSend;
