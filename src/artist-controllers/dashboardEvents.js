const { getArtistEvents, getFotos } = require("../services-mysql/events");
const { getUserName } = require("../services-mysql/users");

var dashboardEvents = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const eventos = await getArtistEvents(data.user.id);
      const fotos = await getFotos();
      const artista = true;
      const logueado = true;
      const dashboard = true;

      return resolve({
        nombre,
        artista,
        logueado,
        dashboard,
        eventos,
        fotos,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = dashboardEvents;
