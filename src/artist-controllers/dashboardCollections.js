const { getArtistsCollections } = require("../services-mysql/colletions");
const { getUserName } = require("../services-mysql/users");

var dashboardCollection = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const colecciones = await getArtistsCollections(data.user.id);
      const artista = true;
      const logueado = true;
      const dashboard = true;

      return resolve({
        nombre,
        artista,
        logueado,
        dashboard,
        colecciones,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = dashboardCollection;
