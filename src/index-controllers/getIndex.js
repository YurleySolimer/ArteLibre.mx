const pool = require("../database");
const isArtist = require("../arteLibre-controllers/isArtist");
const isAdmin = require("../arteLibre-controllers/isAdmin");
const isClient = require("../arteLibre-controllers/isClient");

var getIndex = async (data) => {
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  var obra_destacada = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND recomendar =? LIMIT 1",
    ["True", "Si"]
  );
  var destacadas = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND destacar =? ORDER BY id DESC LIMIT 8",
    ["True", "Si"]
  );

  var artista_destacado = await pool.query(
    "SELECT * FROM usuarioArtista WHERE destacar =? LIMIT 1",
    ["Si"]
  );
  if (artista_destacado.length > 0) {
    var id_artista = artista_destacado[0].id;
    var obra1_artista = await pool.query(
      "SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id ASC LIMIT 1",
      ["True", id_artista]
    );
    var obra2_artista = await pool.query(
      "SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id DESC LIMIT 1",
      ["True", id_artista]
    );
  }

  const eventos = await pool.query("SELECT * FROM eventoCompleto LIMIT 8");
  const coleccion_destacada = await pool.query(
    "SELECT * FROM coleccionArtista WHERE destacar =? LIMIT 1",
    ["Si"]
  );
  var obras_coleccion = [];
  if (coleccion_destacada.length > 0) {
    obras_coleccion = await pool.query(
      "SELECT * FROM obraCompleta WHERE coleccion_id =?",
      [coleccion_destacada[0].id]
    );
  }
  return {
    artista,
    admin,
    nombre,
    cliente,
    logueado,
    eventos,
    coleccion_destacada,
    obras_coleccion,
    obra_destacada,
    destacadas,
    obra1_artista,
    obra2_artista,
    artista_destacado,
  };
};

module.exports = getIndex;
