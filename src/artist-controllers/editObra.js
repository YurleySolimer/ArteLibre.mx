const {
  getCollectionName,
  updateCollection,
} = require("../services-mysql/colletions");
const { updateObra, savePics } = require("../services-mysql/obras");

var editObra = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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
        nombreColeccion = await getCollectionName(coleccion);
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

      const obra = await updateObra(newObra, id);

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

        const foto = await savePics(newFoto);
      }
      const fotoColeccion = {
        fotoNombre: originalname,
      };
      await updateCollection(fotoColeccion, coleccion);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = editObra;
