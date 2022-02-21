const { getArtistsCollections } = require("../services-mysql/colletions");
const { getUserName } = require("../services-mysql/users");

var dashboardCollection = async (data) => {
  const nombre = await getUserName(data.user.id)
  const artista = true;
  const logueado = true;
  const dashboard = true;
  const colecciones = await getArtistsCollections(data.user.id)

  return {
    nombre,
    artista,
    logueado,
    dashboard,
    colecciones,
  };
};
module.exports = dashboardCollection;
