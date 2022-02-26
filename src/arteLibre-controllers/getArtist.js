const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getArtistById, getVisits, updateArtist } = require("../services-mysql/artists");
const { getArtistObras } = require("../services-mysql/obras");
const { getCollections } = require("../services-mysql/colletions");
const { getAllEvents } = require("../services-mysql/events");
const { getUserName } = require("../services-mysql/users");

var getArtist = async (data) => {
  const id = data.params.id;

  const user = await getArtistById(id)
  const obras = await getArtistObras(id)
  const colecciones = await getCollections(id)
  const eventos = await getAllEvents(id)

  var ultima_obra = {
    nombreObra: "N/A",
  };
  if (obras.length > 0) {
    ultima_obra = obras[obras.length - 1];
  }

  var nombre = ''

  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);
  if (artista == true || cliente == true || admin == true) {
    nombre = await getUserName(data.user.id)
  }

  var visitasArray = await getVisits(id)
  if (visitasArray.length > 0) {
    var visitasTotal = visitasArray[0].visitas + 1;
    var visitas = {
      visitas: visitasTotal,
    };
    await updateArtist(visitas, id)
  }

  return {
    user,
    colecciones,
    eventos,
    obras,
    ultima_obra,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};

module.exports = getArtist;
