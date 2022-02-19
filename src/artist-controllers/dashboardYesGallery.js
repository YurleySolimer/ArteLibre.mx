const pool = require("../database");

var dashboardYesGallery = async (data) => {
  const galeria = {
    galeria: "Si",
  };
  await pool.query("UPDATE obras set? WHERE id=?", [galeria, req.params.id]);
  return true;
};

module.exports = dashboardYesGallery;
