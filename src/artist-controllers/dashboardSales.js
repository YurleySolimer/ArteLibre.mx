const pool = require("../database");
const { getArtistObrasSold } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var dashboardSales = async (data) => {
  const nombre = await getUserName(data.user.id)
  const artista = true;
  const logueado = true;
  const dashboard = true;

  const obras = await getArtistObrasSold(data.user.id)

  return {
      artista,
      logueado,
      dashboard,
      nombre,
      obras
  }
};
module.exports = dashboardSales;
