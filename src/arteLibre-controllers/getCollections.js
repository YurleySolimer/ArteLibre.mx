const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getCollections = async (data) => {
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);
  var nombre = ''

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  const colecciones = await pool.query("SELECT * from coleccionArtista");

  return {
    colecciones,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};

module.exports = getCollections;
