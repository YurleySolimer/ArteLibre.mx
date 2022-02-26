const pool = require("../database");

var getNotableCollection = async () => {
  //Get a completed notable collection
  const colletion = await pool.query(
    "SELECT * FROM coleccionArtista WHERE destacar =? LIMIT 1",
    ["Si"]
  );
  return colletion;
};

var getFiveArtistsCollections = async (id) => {
  //Get 5 collections from an artist
  const colletion = await pool.query(
    "SELECT * FROM colecciones WHERE artista_id =? ORDER BY visitas DESC LIMIT 5",
    [id]
  );
  return colletion;
};

var getArtistsCollections = async (id) => {
  //Get all the artist collections
  const colletion = await pool.query(
    "SELECT * from coleccionArtista WHERE artista_id =?",
    [id]
  );
  return colletion;
};

var getCollectionName = async (id) => {
  //Get collection name
  const colletion = await pool.query(
    "SELECT nombreColeccion FROM colecciones WHERE id =?",
    [id]
  );
  return colletion;
};

var updateCollection = async (data, id) => {
  //Get collection name
  const colletion = await pool.query("UPDATE colecciones set? WHERE id=?", [
    data,
    id,
  ]);
  return colletion;
};

var getIdCollection = async (id) => {
  //Get collection name and id
  const colletion = await pool.query(
    "SELECT nombreColeccion, id from colecciones WHERE artista_id =?",
    id
  );
  return colletion;
};

var getCollections = async (id) => {
  //Get collections by artist
  const colletion = await pool.query(
    "SELECT * FROM colecciones WHERE artista_id =?",
    [id]
  );
  return colletion;
};

var saveCollection = async (data) => {
  //
  const colletion = await pool.query("INSERT into colecciones SET ?", [data]);
  return colletion;
};

var getCollectionById = async (id) => {
  //
  const colletion = await pool.query("SELECT * from colecciones WHERE id =?", [
    id,
  ]);
  return colletion;
};

var getArtistCollectionById = async (id) => {
  //
  const colletion = await pool.query(
    "SELECT * from coleccionArtista WHERE id =?",
    [id]
  );
  return colletion;
};

var getCollectionVisits = async (id) => {
  //
  const colletion = await pool.query(
    "SELECT visitas from colecciones WHERE id =?",
    [id]
  );
  return colletion;
};

var updateCollection = async (data, id) => {
  //
  const colletion = await pool.query("UPDATE colecciones  SET ? WHERE id =?", [data, id]);
  return colletion;
};

var getAllCollections = async () => {
  //
  const colletion = await pool.query("SELECT * from coleccionArtista");
  return colletion;
};

var getLastCollection = async () => {
  //
  const colletion = await pool.query(
    "select * from colecciones order by id desc limit 1"
  );
  return colletion;
};


module.exports = {
  getNotableCollection,
  getFiveArtistsCollections,
  getArtistsCollections,
  getCollectionName,
  updateCollection,
  getIdCollection,
  getCollections,
  saveCollection,
  getCollectionById,
  getArtistCollectionById,
  getCollectionVisits,
  updateCollection,
  getAllCollections,
  getLastCollection
};
