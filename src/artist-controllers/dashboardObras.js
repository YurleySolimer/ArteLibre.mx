const { getArtistObras } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var dashboardObras = async (data) => {
  const artista = true;
  const logueado = true;
  const dashboard = true;

  const obras = await getArtistObras(data.user.id)
  const nombre = await getUserName(data.user.id)

  return {
    artista,
    logueado,
    dashboard,
    nombre,
    obras,
  };
};

module.exports = dashboardObras;
