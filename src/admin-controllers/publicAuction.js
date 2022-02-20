const pool = require("../database");

var publicAuctions = async (data) => {
  const { precioBase, horaInicio, fechaInicio, descripcion, duracion, id } =
    data.body;
  const newSubasta = {
    fecha_inicio: fechaInicio,
    hora_inicio: horaInicio,
    duracion,
    precio_base: precioBase,
    descripcion,
    estadoSubasta: "Publicada",
  };

  await pool.query("UPDATE subastasInfo set? WHERE id =?", [newSubasta, id]);
};

module.exports = publicAuctions;
