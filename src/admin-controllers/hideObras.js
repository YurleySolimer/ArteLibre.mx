const pool = require("../database");

var hideObras = async (data) => {
    const ocultar = {
      ocultar: "Si",
    };
    await pool.query("UPDATE obras set? WHERE id=?", [ocultar, data.params.id]);
};

module.exports = hideObras;
