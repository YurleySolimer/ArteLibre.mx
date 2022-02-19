const pool = require("../database");

var dashboardObrasDelete = async (data) => {
  const { id } = data.params;

  await pool.query("DELETE from clienteCompra WHERE id_obra=?", [id]);
  await pool.query("DELETE from subastasInfo WHERE obra_id=?", [id]);
  await pool.query("DELETE from fotosObras WHERE obra_id=?", [id]);

  await pool.query("DELETE from obras WHERE id=?", [id]);
};

module.exports = dashboardObrasDelete;
