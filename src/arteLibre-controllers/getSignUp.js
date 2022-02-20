const pool = require("../database");
const isArtist = require("./isArtist")
const isAdmin = require("./isAdmin")
const isClient = require("./isClient")


var getSignUp = async (data) => {
  const artista = await isArtist(req);
  const cliente = await isClient(req);
  const admin = await isAdmin(req);
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
