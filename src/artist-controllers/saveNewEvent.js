const pool = require("../database");

var saveNewEvent = async (data) => {
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
    descripcion,
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
    descripcion,
    artista_id: data.user.id,
  };

  const evento = await pool.query("INSERT INTO eventos SET?", [newEvento]);
  const artista_eventos = await pool.query(
    "SELECT * FROM eventos WHERE artista_id =?",
    [data.user.id]
  );
  const numero_eventos = {
    numero_eventos: artista_eventos.length,
  };

  await pool.query("UPDATE artistas SET? WHERE user_id =?", [
    numero_eventos,
    data.user.id,
  ]);

  for (var i = 0; i < data.files.length; i++) {
    var principal = "false";
    if (i == 0) {
      principal = "true";
    } else {
      principal = "false";
    }
    const { originalname, path } = data.files[i];
    const newFotoEvento = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      evento_id: evento.insertId,
      principal,
    };
    await pool.query("INSERT INTO fotosEventos SET?", [newFotoEvento]);
  }
};

module.exports = saveNewEvent;
