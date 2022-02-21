const pool = require("../database");

var getNotableObra = async () => {
  //Get a completed obra where is notable
  const obra = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND recomendar =? LIMIT 1",
    ["True", "Si"]
  );
  return obra;
};

var getNotableObras = async () => {
  //Get 8 completed notable obras
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND destacar =? ORDER BY id DESC LIMIT 8",
    ["True", "Si"]
  );
  return obras;
};

var getFirstArtistObra = async (id_artista) => {
  //Get firts obra from an artist
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id ASC LIMIT 1",
    ["True", id_artista]
  );
  return obras;
};

var getLastArtistObra = async (id_artista) => {
  //Get last obra from an artist
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND artista_id ORDER BY id DESC LIMIT 1",
    ["True", id_artista]
  );
  return obras;
};

var getObrasFromCollection = async (coleccion_destacada) => {
  //Get obras from a collection
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE coleccion_id =?",
    [coleccion_destacada[0].id]
  );
  return obras;
};

var getClientObras = async (id) => {
  //Get obras of a client
  const obras = await pool.query(
    "SELECT * from obraComprada WHERE id_user =?",
    [id]
  );
  return obras;
};

var getFiveArtistObras = async (id) => {
  //Get five obras from artists
  const obras = await pool.query(
    "SELECT * FROM obras WHERE artista_id =? ORDER BY visitas DESC LIMIT 5",
    [id]
  );
  return obras;
};

var getArtistObras = async (id) => {
  //Get all the obras from artists
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE artista_id =?",
    [id]
  );
  return obras;
};

module.exports = {
  getNotableObra,
  getNotableObras,
  getFirstArtistObra,
  getLastArtistObra,
  getObrasFromCollection,
  getClientObras,
  getFiveArtistObras,
  getArtistObras,
};
