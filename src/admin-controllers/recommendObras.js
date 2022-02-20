const pool = require("../database");

var recommendObras = async (data) => {
  const { id, text } = data.body;
  const recomendar = {
    recomendar: "Si",
    titulo_recomendada: text,
  };
  const obras = await pool.query("UPDATE obras set? WHERE id=?", [recomendar, id]);
};

module.exports = recommendObras;
