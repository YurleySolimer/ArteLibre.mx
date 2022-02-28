const { getArtistId } = require("../services-mysql/artists");
const { getIdCollection } = require("../services-mysql/colletions");
const { getUserName } = require("../services-mysql/users");

var getNewObra = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const artista = true;
      const logueado = true;
      const nombre = await getUserName(data.user.id);
      const artistainfo = await getArtistId(data.user.id);
      const colecciones = await getIdCollection(artistainfo[0]);

      return resolve({
        nombre,
        artista,
        logueado,
        colecciones,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getNewObra;
