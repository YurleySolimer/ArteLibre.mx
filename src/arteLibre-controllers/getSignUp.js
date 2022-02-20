const pool = require("../database");
const isArtist = require("./isArtist")
const isAdmin = require("./isAdmin")
const isClient = require("./isClient")


var getSignUp = async (data) => {
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);
  const nombre = "";

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  return {
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};

module.exports = getSignUp;
