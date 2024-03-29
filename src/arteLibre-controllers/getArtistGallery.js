const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getUserName, getUserArtist } = require("../services-mysql/users");
const { getObraGallery1, getObraGallery2 } = require("../services-mysql/obras");
const { getGalleryVisits, updateArtist } = require("../services-mysql/artists");

var getArtistGallery = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      artista = await isArtist(data);
      cliente = await isClient(data);
      admin = await isAdmin(data);
      var nombre = "";

      if (artista == true || cliente == true || admin == true) {
        nombre = await getUserName(data.user.id);
      }
      const user = await getUserArtist(data.params.id);
      const obras1 = await getObraGallery1(data.params.id, "Si");
      const obras2 = await getObraGallery2(data.params.id, "Si");

      var visitasArray = await getGalleryVisits(data.params.id);
      var visitasTotal = visitasArray[0].visitasGaleria + 1;
      var visitasGaleria = {
        visitasGaleria: visitasTotal,
      };
      await updateArtist(visitasGaleria, data.params.id);

      return resolve({
        user: user[0],
        obras1,
        obras2,
        artista,
        cliente,
        admin,
        logueado,
        nombre,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getArtistGallery;
