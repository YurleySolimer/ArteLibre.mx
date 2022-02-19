const pool = require("../database");

var saveNewObra = async (data) => {
  //GUARDANDO DATOS DE LA OBRA//
  const {
    nombreObra,
    coleccion,
    creacion,
    tecnica,
    estilo,
    precioFinal,
    ancho,
    alto,
    subasta,
    copias,
    descripcion,
    lcreacion,
    fcreacion,
  } = data.body;
  var nombreColeccion = "N/A";
  var subastar = "No";

  if (subasta == "on") {
    subastar = "Si";
  }

  if (coleccion > 0) {
    nombreColeccion = await pool.query(
      "SELECT nombreColeccion FROM colecciones WHERE id =?",
      [coleccion]
    );
    nombreColeccion = nombreColeccion[0];
  }

  const newObra = {
    nombreObra: nombreObra,
    coleccion: nombreColeccion.nombreColeccion,
    coleccion_id: coleccion,
    lugarCreacion: lcreacion,
    fecha_creacion: fcreacion,
    tecnica,
    estilo,
    ancho,
    alto,
    subastar,
    precio: precioFinal,
    descripcion,
    artista_id: data.user.id,
  };

  const obra = await pool.query("INSERT INTO obras set ?", [newObra]);

  if (subastar == "Si") {
    const newSubasta = {
      obra_id: obra.insertId,
    };

    await pool.query("INSERT INTO subastasInfo set ?", [newSubasta]);
  }

  const artista_obras = await pool.query(
    "SELECT * FROM obras WHERE artista_id =?",
    [data.user.id]
  );
  const numero_obras = {
    numero_obras: artista_obras.length,
  };

  await pool.query("UPDATE artistas SET? WHERE user_id =?", [
    numero_obras,
    data.user.id,
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
      obra_id: obra.insertId,
    };

    const foto = await pool.query("INSERT INTO fotosObras set ?", [newFoto]);
  }

  artista = true;
  logueado = true;

  const todoColeccicones = await pool.query(
    "SELECT * from colecciones WHERE id =?",
    [coleccion]
  );
  if (todoColeccicones.length > 0) {
    var precioPromedio =
      todoColeccicones[0].precioPromedio * 1 + precioFinal * 1;
    const colecicon_obras = await pool.query(
      "SELECT * FROM obras WHERE coleccion_id =?",
      [coleccion]
    );
    var piezas = 0;
    if (colecicon_obras) {
      piezas = colecicon_obras.length;
    } else {
      piezas + 1;
    }

    const NewColeccion = {
      fotoNombre: originalname,
      precioPromedio,
      piezas,
    };
    await pool.query("UPDATE colecciones set? WHERE id=?", [
      NewColeccion,
      coleccion,
    ]);
  }
};

module.exports = saveNewObra;
