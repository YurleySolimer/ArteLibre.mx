const pool = require("../database");

var getLastArtistAuction = async (id) => {
  //Get an auction
  const auction = await pool.query(
    "SELECT * FROM obraSubasta WHERE artista_id =?  ORDER BY id DESC LIMIT 1",
    [id]
  );
  return auction;
};

var deleteAuctionInfo = async (id) => {
  //Get an auction
  const auction = await pool.query("DELETE from subastasInfo WHERE obra_id=?", [
    id,
  ]);
  return auction;
};

var saveAuctionInfo = async (data) => {
  //save an auction
  const auction = await pool.query("INSERT INTO subastasInfo set ?", [data]);
  return auction;
};

var getAuctionById = async (id) => {
  //save an auction
  const auction = await pool.query("SELECT * FROM obraSubasta WHERE id =?", [
    id,
  ]);
  return auction;
};

var getAllAuctions = async () => {
  //save an auction
  const auction = await pool.query("SELECT * FROM obraSubasta");
  return auction;
};

var updateAuctionsInfo = async (data, id) => {
  //save an auction
  const auction = await pool.query(
    "UPDATE subastasInfo SET? WHERE obra_id =?",
    [data, id]
  );
  return auction;
};

var getNextAuctions = async () => {
  //save an auction
  const auction = await pool.query(
    "select * from obraSubasta order by fecha_inicio desc limit 3 "
  );
  return auction;
};

module.exports = {
  getLastArtistAuction,
  deleteAuctionInfo,
  saveAuctionInfo,
  getAuctionById,
  getAllAuctions,
  updateAuctionsInfo,
  getNextAuctions
};
