const pool = require("../database");

var featureObras = async (data) => {
  const { id } = data.body;
  const destacar = {
    destacar: "Si",
  };
  await pool.query("UPDATE obras set? WHERE id=?", [destacar, id]);
};

module.exports = featureObras;
