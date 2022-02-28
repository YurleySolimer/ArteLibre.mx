const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const {
  getMainObraNoHide,
  filterObras1,
  filterObras2,
} = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var getObras = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      var obras = await getMainObraNoHide();
      artista = await isArtist(data);
      cliente = await isClient(data);
      admin = await isAdmin(data);
      var nombre = "";

      if (artista == true || cliente == true || admin == true) {
        nombre = await getUserName(data.user.id);
      }

      if (data.query) {
        if (data.query.tecnicaPinturas || data.query.artistaPinturas) {
          obras = await filterObras1(data);
        }
        if (data.query.tecnicaPinturas && data.query.artistaPinturas) {
          obras = await filterObras2(data);
        }
      }

      return resolve({
        obras,
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
module.exports = getObras;
