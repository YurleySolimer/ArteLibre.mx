const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getUserName } = require("../services-mysql/users");

var getSignUp = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const artista = await isArtist(data);
      const cliente = await isClient(data);
      const admin = await isAdmin(data);
      let nombre = "";

      if (artista == true || cliente == true || admin == true) {
        nombre = await getUserName(data.user.id);
      }

      return resolve({
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

module.exports = getSignUp;
