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

module.exports = {
  getNotableCollection,
  getFiveArtistsCollections,
  getArtistsCollections,
};
