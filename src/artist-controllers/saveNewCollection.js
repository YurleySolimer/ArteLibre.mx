const { updateArtist } = require("../services-mysql/artists");
const {
  getCollections,
  saveCollection,
} = require("../services-mysql/colletions");

var saveNewCollection = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      await saveCollection(newColeccion);

      const artista_colecciones = await getCollections(data.user.id);
      const numero_colecciones = {
        numero_colecciones: artista_colecciones.length,
      };

      await updateArtist(numero_colecciones, data.user.id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = saveNewCollection;
