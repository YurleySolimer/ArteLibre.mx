const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getArtists = async (data) => {
  var artistas = await pool.query(
    "SELECT * FROM usuarioArtista ORDER BY nombre ASC"
  );

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

  if (data.query) {
    if (
      data.query.tecnicaArtistas ||
      data.query.nombreArtistas ||
      data.query.tipoArtistas
    ) {
      artistas = await pool.query(
        "SELECT * FROM usuarioArtista WHERE nombre =? OR apellido =? OR disciplina_principal =? OR disciplina_sec =?",
        [
          data.query.nombreArtistas,
          data.query.nombreArtistas,
          data.query.tecnicaArtistas,
          data.query.tecnicaArtistas,
        ]
      );
    }
    if (data.query.tecnicaArtistas && data.query.nombreArtistas) {
      artistas = await pool.query(
        "SELECT * FROM usuarioArtista WHERE nombre =? OR apellido =? AND disciplina_principal =? OR disciplina_sec =?",
        [
          data.query.nombreArtistas,
          data.query.nombreArtistas,
          data.query.tecnicaArtistas,
          data.query.tecnicaArtistas,
        ]
      );
    }
  }

  return {
    artistas,
    artista,
    cliente,
    logueado,
    admin,
    nombre,
  }
};
module.exports = getArtists;
