const pool = require("../database");
const { getArtistObrasAuction } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var dashboardAuction = async (data) => {
  const nombre = await getUserName(data.user.id)
  const artista = true;
  const logueado = true;
  const dashboard = true;
  const obras = await getArtistObrasAuction(data.user.id)
  return {
      nombre,
      artista,
      logueado,
      dashboard,
      obras
  }
};
module.exports = dashboardAuction;
