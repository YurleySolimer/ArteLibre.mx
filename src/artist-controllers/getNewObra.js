const { getArtistId } = require("../services-mysql/artists");
const { getIdCollection } = require("../services-mysql/colletions");
const { getUserName } = require("../services-mysql/users");

var getNewObra = async (data) => {
  const nombre = await getUserName(data.user.id)
  const artista = true;
  const logueado = true;

  const artistainfo = await getArtistId(data.user.id)
  const colecciones = await getIdCollection(artistainfo[0])

  return {
      nombre,
      artista,
      logueado,
      colecciones
  }
};

module.exports = getNewObra;
