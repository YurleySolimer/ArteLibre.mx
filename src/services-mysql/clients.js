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
  return client[0];
};

var deleteClientShop = async (id) => {
  //Delete
  const client = await pool.query("DELETE from clienteCompra WHERE id_obra=?", [id]);
  return client;
};

var updateClientShop = async (data, id) => {
  //
  const client = await pool.query("UPDATE clienteCompra SET? WHERE id =?", [
    data,
    id,
  ]);
  return client;
};

var saveClientShop = async (data) => {
  //
  const client = await pool.query("INSERT INTO clienteCompra SET?", [newCompra]);
  return client;
};


var getClientData = async (id) => {
  //
  const client = await pool.query(
    "SELECT * FROM clientes WHERE user_id =?",
    [id]
  );
  return client;
};

var updateClient = async (data, id) => {
  //
  const client = await pool.query("UPDATE clientes SET? WHERE user_id=?", [
    data,
    id,
  ]);
  return client;
};

var getAllClients = async () => {
  //
  const client = await pool.query("SELECT * FROM usuarioCliente");
  return client;
};

var getClientsByRegion = async () => {
  //
  const client = await pool.query(
    "SELECT region, count(*) as numero from clientes  group by region order by numero desc limit 5"
  );
  return client;
};

var getTotalClients = async () => {
  //
  const client = await pool.query("SELECT * from clientes");
  return client;
};

var getTopClients = async () => {
  //
  const client = await pool.query(
    "SELECT * from usuarioCliente order by obrasCompradas desc limit 5"
  );
  return client;
};

var getTotalShoppers = async () => {
  //
  const client = await pool.query(
    "SELECT id_user, count(*) as comprador from clienteCompra group by id_user"
  );;
  return client;
};


module.exports = {
  saveClient,
  getClientCompleted,
  deleteClientShop,
  updateClientShop,
  saveClientShop,
  getClientData,
  updateClient,
  getAllClients,
  getClientsByRegion,
  getTotalClients,
  getTopClients,
  getTotalShoppers
};
