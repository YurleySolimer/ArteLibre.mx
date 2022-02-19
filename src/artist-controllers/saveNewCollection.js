const pool = require("../database");

var saveNewCollection = async (data) => {
  const {
    nombre,
    año,
    descripcion,
    estilo,
    tecnica,
    ubicacionPais,
    ubicacionCiudad,
  } = data.body;
  const newColeccion = {
    nombreColeccion: nombre,
    anio: año,
    descripcion,
    estilo,
    tecnica,
    pais: ubicacionPais,
    ciudad: ubicacionCiudad,
    artista_id: data.user.id,
  };
  await pool.query("INSERT into colecciones SET ?", [newColeccion]);

  const artista_colecciones = await pool.query(
    "SELECT * FROM colecciones WHERE artista_id =?",
    [data.user.id]
  );
  const numero_colecciones = {
    numero_colecciones: artista_colecciones.length,
  };

  await pool.query("UPDATE artistas SET? WHERE user_id =?", [
    numero_colecciones,
    data.user.id,
  ]);
};

module.exports = saveNewCollection;
