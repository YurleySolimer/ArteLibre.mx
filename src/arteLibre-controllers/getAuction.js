const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getUserName } = require("../services-mysql/users");
const { getAuctionById } = require("../services-mysql/auctions");
const { getObraPics, getMainObra } = require("../services-mysql/obras");

var getAuction = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const artista = await isArtist(data);
      const cliente = await isClient(data);
      const admin = await isAdmin(data);
      var nombre = "";

      if (artista == true || cliente == true || admin == true) {
        nombre = await getUserName(data.user.id);
      }

      const subasta = await getAuctionById(data.params.id);
      const obraId = subasta[0].obraId;
      const fotos = await getObraPics(obraId);
      const obras = await getMainObra();

      var myArray = [];
      for (var i = 0; i < 3; i++) {
        var numeroAleatorio = Math.ceil(Math.random() * obras.length);
        var existe = false;
        for (var j = 0; j < myArray.length; j++) {
          if (myArray[j] == obras[numeroAleatorio - 1]) {
            existe = true;
          }
        }
        if (existe == false) {
          myArray[i] = obras[numeroAleatorio - 1];
        }
      }

      return resolve({
        artista,
        cliente,
        myArray,
        logueado,
        admin,
        subasta,
        fotos,
        nombre,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = getAuction;
