const pool = require("../database");

var dashboardObrasHide = async (data) => {
  const { id } = data.params;
  const ocultar = {
    ocultar: "Si",
  };

  await pool.query("UPDATE obras set? WHERE id=?", [ocultar, id]);
};

module.exports = dashboardObrasHide;
