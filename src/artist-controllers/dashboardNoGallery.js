const pool = require("../database");

var dashboardNoGallery = async (data) => {
  const galeria = {
    galeria: "No",
  };
  await pool.query("UPDATE obras set? WHERE id=?", [galeria, data.params.id]);
  return true;
};

module.exports = dashboardNoGallery;
