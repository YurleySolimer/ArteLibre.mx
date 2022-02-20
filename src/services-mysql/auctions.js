const pool = require("../database");

var getLastArtistAuction = async (id) => {
  //Get an auction
  const auction = await pool.query(
    "SELECT * FROM obraSubasta WHERE artista_id =?  ORDER BY id DESC LIMIT 1",
    [id]
  );
  return auction;
};

module.exports = {
  getLastArtistAuction,
};
