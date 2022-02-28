const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getUserName } = require("../services-mysql/users");
const { getAllCollections } = require("../services-mysql/colletions");

var getCollections = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const artista = await isArtist(data);
      const cliente = await isClient(data);
      const admin = await isAdmin(data);
      var nombre = "";

      if (artista == true || cliente == true || admin == true) {
        nombre = await getUserName(data.user.id);
      }

      const colecciones = await getAllCollections();

      return resolve({
        colecciones,
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

module.exports = getCollections;
