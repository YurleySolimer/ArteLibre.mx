const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getUserName } = require("../services-mysql/users");
const {
  getEventById,
  getEventPics,
  getEventVisits,
  updateEvent,
} = require("../services-mysql/events");

var getEvent = async (data) => {
  artista = await isArtist(data);
  cliente = await isClient(data);
  admin = await isAdmin(data);
  var nombre = "";

  if (artista == true || cliente == true || admin == true) {
    nombre = await getUserName(data.user.id);
  }

  const evento = await getEventById(data.params.id);
  const fotos = await getEventPics(data.params.id);

  var visitasArray = await getEventVisits(data.params.id);

  var visitasTotal = visitasArray[0].visitas + 1;
  var visitas = {
    visitas: visitasTotal,
  };
  await updateEvent(visitas, data.params.id);

  return {
    evento,
    fotos,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};
module.exports = getEvent;
