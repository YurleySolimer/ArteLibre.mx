const pool = require("../database");
const { updateAuctionsInfo } = require("../services-mysql/auctions");

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

  updateAuctionsInfo(newSubasta, id)
};

module.exports = publicAuctions;
