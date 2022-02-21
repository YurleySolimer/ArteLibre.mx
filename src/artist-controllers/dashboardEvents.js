const { getArtistEvents, getFotos } = require("../services-mysql/events");
const { getUserName } = require("../services-mysql/users");

var dashboardEvents = async (data) => {
  const nombre = await getUserName(data.user.id);
  const artista = true;
  const logueado = true;
  const dashboard = true;
  const eventos = await getArtistEvents(data.user.id);
  const fotos = await getFotos();

  return {
    nombre,
    artista,
    logueado,
    dashboard,
    eventos,
    fotos,
  };
};
module.exports = dashboardEvents;
