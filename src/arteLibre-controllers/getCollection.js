const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getUserName } = require("../services-mysql/users");
const { getArtistCollectionById, getCollectionVisits, updateCollection } = require("../services-mysql/colletions");
const { getObrasCompletedByCollection, getMainObra } = require("../services-mysql/obras");

var getCollection = async (data) => {
  const id = data.params.id;
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);
  var nombre = ''

  if (artista == true || cliente == true || admin == true) {
    nombre = await getUserName(data.user.id)
  }

  var obras = [];
  const colecciones = await getArtistCollectionById(id)

  if (colecciones.length > 0) {
    obras = await getObrasCompletedByCollection(id)     
  }

  var visitasArray = await getCollectionVisits(id)
  var visitasTotal = visitasArray[0].visitas + 1;
  var visitas = {
    visitas: visitasTotal,
  };
  await updateCollection(visitas, id)

  const obras2 = await getMainObra()

  var myArray = [];
  for (var i = 0; i < 3; i++) {
    var numeroAleatorio = Math.ceil(Math.random() * obras2.length);
    var existe = false;
    for (var j = 0; j < myArray.length; j++) {
      if (myArray[j] == obras[numeroAleatorio - 1]) {
        existe = true;
      }
    }
    if (existe == false) {
      myArray[i] = obras2[numeroAleatorio - 1];
    }
  }

  return {
    colecciones,
    obras,
    myArray,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};

module.exports = getCollection;
