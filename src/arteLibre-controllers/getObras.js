const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getObras = async (data) => {
  var obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND ocultar =? ORDER BY id DESC",
    ["True", "No"]
  );
  artista = await isArtist(data);
  cliente = await isClient(data);
  admin = await isAdmin(data);
  var nombre = ''

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  if (data.query) {
    if (data.query.tecnicaPinturas || data.query.artistaPinturas) {
      obras = await pool.query(
        "SELECT * FROM obraCompleta WHERE nombre =? OR apellido =? OR tecnica =?",
        [
          data.query.artistaPinturas,
          data.query.artistaPinturas,
          data.query.tecnicaPinturas,
        ]
      );
    }
    if (data.query.tecnicaPinturas && data.query.artistaPinturas) {
      obras = await pool.query(
        "SELECT * FROM obraCompleta WHERE nombre =? OR apellido =? AND tecnica =?",
        [
          data.query.artistaPinturas,
          data.query.artistaPinturas,
          data.query.tecnicaPinturas,
        ]
      );
    }
  }

  return {
    obras,
    artista,
    cliente,
    logueado,
    admin,
    nombre
  };
};
module.exports = getObras;
