const pool = require("../database");

var saveClient = async (newCliente) => {
  //Save a new client in DB
  const client = await pool.query("INSERT INTO clientes SET ? ", newCliente);
  return client;
};

module.exports = {
  saveClient,
};
