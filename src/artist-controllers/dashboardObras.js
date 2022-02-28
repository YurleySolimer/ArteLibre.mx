const { getArtistObras } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var dashboardObras = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const artista = true;
      const logueado = true;
      const dashboard = true;

      const obras = await getArtistObras(data.user.id);
      const nombre = await getUserName(data.user.id);

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

module.exports = dashboardObras;
