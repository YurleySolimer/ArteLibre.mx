const pool = require("../database");

var saveClient = async (newCliente) => {
  //Save a new client in DB
  const client = await pool.query("INSERT INTO clientes SET ? ", newCliente);
  return client;
};

var getClientCompleted = async (id) => {
  //Get all data about a client
  const client = await pool.query("SELECT * from usuarioCliente WHERE id =?", [
    id,
  ]);
  return client;
};

var deleteClientShop = async (id) => {
  //Delete
  const client = pool.query("DELETE from clienteCompra WHERE id_obra=?", [id]);
  return client;
};

var updateClientShop = async (data, id) => {
  //Delete
  const client = pool.query("UPDATE clienteCompra SET? WHERE id =?", [
    data,
    id,
  ]);
  return client;
};

module.exports = {
  saveClient,
  getClientCompleted,
  deleteClientShop,
  updateClientShop,
};
