const { getArtistObras } = require("../services-mysql/obras");
const { getUserName, getUserArtist } = require("../services-mysql/users");

var artistProfile = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const user = await getUserArtist(data.user.id);
      const obras = await getArtistObras(data.user.id);
      var ultima_obra = {
        nombreObra: "N/A",
        id: "#",
      };
      if (obras.length > 0) {
        ultima_obra = obras[obras.length - 1];
      }
      artista = true;
      logueado = true;

      return resolve({
        nombre,
        user,
        obras,
        ultima_obra,
        artista,
        logueado,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = artistProfile;
