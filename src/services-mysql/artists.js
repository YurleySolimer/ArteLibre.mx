const pool = require("../database");

var saveArtist = async (newArtista) => {
  //Save a new artist in DB
  const artist = await pool.query("INSERT INTO artistas SET ? ", newArtista);
  return artist;
};

module.exports = {
  saveArtist,
};
