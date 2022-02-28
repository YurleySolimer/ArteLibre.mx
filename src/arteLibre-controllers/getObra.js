const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const {
  getObrasCompletedById,
  getObraPics,
  getMainObra,
  updateObra,
  getObraVisits,
} = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var getObra = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = data.params.id;
      const obra = await getObrasCompletedById(id);
      const fotos = await getObraPics(id);
      const obras = await getMainObra();

      const artista = await isArtist(data);
      const cliente = await isClient(data);
      const admin = await isAdmin(data);
      var nombre = "";

      var visitasArray = await getObraVisits(id);
      if (visitasArray.length > 0) {
        var visitasTotal = visitasArray[0].visitas + 1;
        var visitas = {
          visitas: visitasTotal,
        };
        await updateObra(visitas, id);
      }

      if (artista == true || cliente == true || admin == true) {
        nombre = await getUserName(data.user.id);
      }

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
        obra: obra[0],
        fotos,
        myArray,
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

module.exports = getObra;
