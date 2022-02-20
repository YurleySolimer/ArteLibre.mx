const pool = require("../database");

var saveArtist = async (newArtista) => {
  //Save a new artist in DB
  const artist = await pool.query("INSERT INTO artistas SET ? ", newArtista);
  return artist;
};

var getNotableArtist = async () => {
  //Get a completed artist where is notable
  const artist = await pool.query(
    "SELECT * FROM usuarioArtista WHERE destacar =? LIMIT 1",
    ["Si"]
  );
  return artist;
};

module.exports = {
  saveArtist,
  getNotableArtist,
};
