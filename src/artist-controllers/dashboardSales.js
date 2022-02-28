const pool = require("../database");
const { getArtistObrasSold } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var dashboardSales = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const obras = await getArtistObrasSold(data.user.id);

      const artista = true;
      const logueado = true;
      const dashboard = true;

      return resolve({
        artista,
        logueado,
        dashboard,
        nombre,
        obras,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = dashboardSales;
