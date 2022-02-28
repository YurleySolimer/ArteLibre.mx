const { getArtistObrasAuction } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var dashboardAuction = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const obras = await getArtistObrasAuction(data.user.id);
      const artista = true;
      const logueado = true;
      const dashboard = true;
      return resolve({
        nombre,
        artista,
        logueado,
        dashboard,
        obras,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = dashboardAuction;
