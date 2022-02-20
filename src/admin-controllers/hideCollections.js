const pool = require("../database");

var hideCollections = async (data) => {
  const ocultar = {
    ocultar: "Si",
  };
  await pool.query("UPDATE colecciones set? WHERE id=?", [
    ocultar,
    data.params.id,
  ]);
};

module.exports = hideCollections;
