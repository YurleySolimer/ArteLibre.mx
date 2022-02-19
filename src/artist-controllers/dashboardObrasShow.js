const pool = require("../database");

var dashboardObrasShow = async (data) => {
  const { id } = data.params;
  const ocultar = {
    ocultar: "No",
  };

  await pool.query("UPDATE obras set? WHERE id=?", [ocultar, id]);
};

module.exports = dashboardObrasShow;
