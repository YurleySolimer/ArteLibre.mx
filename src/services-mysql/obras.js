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

var getArtistObrasAuction = async (id) => {
  //Get all the obras from artists
  const obras = await pool.query(
    "SELECT * FROM obraSubasta WHERE artista_id=?",
    [id]
  );

  return obras;
};

var updateObra = async (data, id) => {
  //Update data from an obra
  const obra = await pool.query("UPDATE obras set? WHERE id=?", [data, id]);
  return obra;
};

var deleteObraPics = async (id) => {
  //Delete all pics from an obra
  const obra = await pool.query("DELETE from fotosObras WHERE obra_id=?", [id]);
  return obra;
};

var deleteObra = async (id) => {
  //Delete an obra data
  const obra = await pool.query("DELETE from obras WHERE id=?", [id]);
  return obra;
};

var getArtistObrasSold = async (id) => {
  //Delete an obra data
  const obra = await pool.query(
    "SELECT * FROM obraComprada WHERE artista_id =?",
    [id]
  );
  return obra;
};

var getObraBySoldDate = async (id, date) => {
  //Get an obra
  const obra = await pool.query(
    "select * from obraComprada	where artista_id =? and  fecha_compra =?",
    [id, date]
  );
  return obra;
};

var getObrasWeekly = async (id, date, today) => {
  //Get obras in a week
  const obras = await pool.query(
    "select * from obraComprada	where artista_id =? and  fecha_compra BETWEEN ? AND ?",
    [id, date, hoy]
  );
  return obras;
};

var getObrasMothly = async (id, date) => {
  //Get in a month
  const obras = await pool.query(
    "select * from obraComprada	where artista_id =? and  fecha_compra BETWEEN ? AND ?",
    [id, date, hoy]
  );
  return obras;
};

var savePics = async (data) => {
  //save pics of obras
  const obra = await pool.query("INSERT INTO fotosObras set ?", [data]);
  return obra;
};


var saveObra = async (data) => {
  //save new obra
  const obra = await pool.query("INSERT INTO obras set ?", [data]);
  return obra;
};


var getAllArtistObras = async (id) => {
  //save new obra
  const obra = await pool.query(
    "SELECT * FROM obras WHERE artista_id =?",
    [id]
  );
  return obra;
};

var getObrasByCollection = async (collection) => {
  //save new obra
  const obra = await pool.query(
    "SELECT * FROM obras WHERE coleccion_id =?",
    [collection]
  );
  return obra;
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
  getArtistObrasAuction,
  updateObra,
  deleteObraPics,
  deleteObra,
  getArtistObrasSold,
  getObraBySoldDate,
  getObrasWeekly,
  getObrasMothly,
  savePics,
  saveObra,
  getAllArtistObras,
  getObrasByCollection
};
