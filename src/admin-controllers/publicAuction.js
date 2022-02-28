const pool = require("../database");
const { updateAuctionsInfo } = require("../services-mysql/auctions");

var publicAuctions = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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

      updateAuctionsInfo(newSubasta, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = publicAuctions;
