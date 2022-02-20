const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getEvents = async (data) => {
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  const eventos = await pool.query("SELECT * FROM eventoCompleto");

  return {
    eventos,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};
module.exports = getEvents;
