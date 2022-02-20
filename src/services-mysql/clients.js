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

module.exports = {
  saveClient,
  getClientCompleted,
};
