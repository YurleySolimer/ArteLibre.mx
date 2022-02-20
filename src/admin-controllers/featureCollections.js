const pool = require("../database");

var featureCollections = async (data) => {
  const { id } = data.body;
  const destacar = {
    destacar: "Si",
  };
  await pool.query("UPDATE colecciones set? WHERE id=?", [destacar, id]);
};

module.exports = featureCollections;
