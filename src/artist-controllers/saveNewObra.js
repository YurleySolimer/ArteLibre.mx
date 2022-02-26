const { updateArtist } = require("../services-mysql/artists");
const { saveAuctionInfo } = require("../services-mysql/auctions");
const {
  getCollectioName,
  getCollectionById,
  updateCollection,
} = require("../services-mysql/colletions");
const {
  saveObra,
  getAllArtistObras,
  savePics,
  getObrasByCollection,
} = require("../services-mysql/obras");

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
    nombreColeccion = await getCollectioName(coleccion);
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

  const obra = await saveObra(newObra);

  if (subastar == "Si") {
    const newSubasta = {
      obra_id: obra.insertId,
    };

    await saveAuctionInfo(newSubasta);
  }

  const artista_obras = await getAllArtistObras(data.user.id);
  const numero_obras = {
    numero_obras: artista_obras.length,
  };

  await updateArtist(numero_obras, data.user.id);

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

    const foto = await savePics(newFoto);
  }

  artista = true;
  logueado = true;

  const todoColeccicones = await getCollectionById(coleccion);
  if (todoColeccicones.length > 0) {
    var precioPromedio =
      todoColeccicones[0].precioPromedio * 1 + precioFinal * 1;
    const colecicon_obras = await getObrasByCollection(coleccion);
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
    await updateCollection(NewColeccion, coleccion);
  }
};

module.exports = saveNewObra;
