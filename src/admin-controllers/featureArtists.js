const pool = require("../database");

var featureArtists = async (data) => {
  const { id, text } = data.body;
  const destacar = {
    destacar: "Si",
    info_destacar: text,
  };
  await pool.query("UPDATE artistas set? WHERE id=?", [destacar, id]);
};

module.exports = featureArtists;
