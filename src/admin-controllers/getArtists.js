const { getAllArtists } = require("../services-mysql/artists");
const { getUserName } = require("../services-mysql/users");

var getArtists = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = true;
      const logueado = true;

      var artistasCompletos = await getAllArtists();
      const nombre = await getUserName(data.user.id);

      return resolve({
        nombre,
        admin,
        logueado,
        dashboard,
        artistasCompletos,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getArtists;
