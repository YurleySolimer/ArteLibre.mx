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

  return {
    obras,
    artista,
    cliente,
    logueado,
    admin,
    nombre,
  };
};
module.exports = getObras;
