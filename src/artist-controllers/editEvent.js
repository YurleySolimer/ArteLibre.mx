const { updateEvent } = require("../services-mysql/events");

var editEvent = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = data.params;

      const {
        nombre,
        titulo,
        organizadores,
        hora,
        inicio,
        fin,
        local,
        direccion,
        piezas,
        ciudad,
        pais,
        estilo,
      } = data.body;
      const newEvento = {
        nombre,
        titulo,
        organizadores,
        hora_inicio: hora,
        fecha_inicio: inicio,
        fecha_fin: fin,
        dir_local: local,
        direccion,
        ciudad,
        pais,
        piezas,
        estilo,
      };

      const evento = await updateEvent(newEvento, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = editEvent;
