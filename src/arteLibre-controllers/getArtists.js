const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const {
  getAllArtists,
  filterArtists1,
  filterArtists2,
} = require("../services-mysql/artists");
const { getUserName } = require("../services-mysql/users");

var getArtists = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      var artistas = await getAllArtists();

      const artista = await isArtist(data);
      const cliente = await isClient(data);
      const admin = await isAdmin(data);
      var nombre = "";

      if (artista == true || cliente == true || admin == true) {
        nombre = await getUserName(data.user.id);
      }

      if (data.query) {
        if (
          data.query.tecnicaArtistas ||
          data.query.nombreArtistas ||
          data.query.tipoArtistas
        ) {
          artistas = await filterArtists1(data);
        }
        if (data.query.tecnicaArtistas && data.query.nombreArtistas) {
          artistas = await filterArtists2(data);
        }
      }

      return resolve({
        artistas,
        artista,
        cliente,
        logueado,
        admin,
        nombre,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getArtists;
