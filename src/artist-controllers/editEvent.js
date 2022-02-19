const pool = require("../database");

var editEvent = async (data) => {
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

  const evento = await pool.query("UPDATE eventos SET ? WHERE id =?", [
    newEvento,
    id,
  ]);
};

module.exports = editEvent;
