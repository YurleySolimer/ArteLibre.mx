const pool = require("../database");

var suspendArtists = async (data) => {
  const inactivo = {
    inactivo: "Si",
  };
  await pool.query("UPDATE artistas set? WHERE id=?", [
    inactivo,
    data.params.id,
  ]);
};

module.exports = suspendArtists;
