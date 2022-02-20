const pool = require("../database");
const isClient = require("./isClient");

var getObraSuccess = async (data) => {
  cliente = await isClient(data);
  if (cliente == true) {
    const id = data.params.id;
    const newCompra = {
      estado: "Pago",
      id_obra: id,
      id_user: data.user.id,
    };

    await pool.query("INSERT INTO clienteCompra SET?", [newCompra]);
    const comprada = {
      comprada: "Si",
    };
    await pool.query("UPDATE obras SET ? WHERE id = ? ", [comprada, id]);

    const precioObra = await pool.query(
      "SELECT precio FROM obras WHERE id =?",
      [id]
    );

    var obrasCompradas = await pool.query(
      "SELECT * FROM clientes WHERE user_id =?",
      [data.user.id]
    );
    var obrasTotal = obrasCompradas[0].obrasCompradas + 1;
    const totalCompras = obrasCompradas[0].totalCompras + precioObra[0].precio;
    const date = new Date();
    const hoy = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    var obrasTotalCompradas = {
      obrasCompradas: obrasTotal,
      ultima_compra: hoy,
      totalCompras,
    };

    await pool.query("UPDATE clientes SET? WHERE user_id=?", [
      obrasTotalCompradas,
      data.user.id,
    ]);
  }

  return true
};

module.exports = getObraSuccess;
