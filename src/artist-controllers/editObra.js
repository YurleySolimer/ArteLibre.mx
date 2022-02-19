const pool = require("../database");

var editObra = async (data) => {
  const { id } = data.body;

  //ACTUALIZANDO DATOS DE LA OBRA//
  const {
    nombre,
    coleccion,
    creacion,
    tecnica,
    estilo,
    precio,
    ancho,
    alto,
    subasta,
    copias,
    descripcion,
    lcreacion,
    fcreacion,
  } = data.body;
  var nombreColeccion = "N/A";

  if (coleccion > 0) {
    nombreColeccion = await pool.query(
      "SELECT nombreColeccion FROM colecciones WHERE id =?",
      [coleccion]
    );
    nombreColeccion = nombreColeccion[0];
  }
  const newObra = {
    nombreObra: nombre,
    coleccion: nombre,
    coleccion_id: coleccion,
    lugarCreacion: lcreacion,
    fecha_creacion: fcreacion,
    tecnica,
    estilo,
    ancho,
    alto,
    precio,
    descripcion,
    artista_id: data.user.id,
  };

  const obra = await pool.query("UPDATE obras set ? WHERE id =?", [
    newObra,
    id,
  ]);

  //GUARDANDO FOTOS DE LA OBRA//

  const fotos = data.files;
  var principal = "false";
  for (var i = 0; i < fotos.length; i++) {
    if (i == fotos.length - 1) {
      principal = true;
    }
    const path = fotos[i].path;
    var originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      principal,
      obra_id: id,
    };

    const foto = await pool.query("INSERT INTO fotosObras set ?", [newFoto]);
  }
  const fotoColeccion = {
    fotoNombre: originalname,
  };
  await pool.query("UPDATE colecciones set? WHERE id=?", [
    fotoColeccion,
    coleccion,
  ]);
};

module.exports = editObra;
