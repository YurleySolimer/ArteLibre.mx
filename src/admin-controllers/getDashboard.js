const { getAllArtistsByVisits, getRelevantArtists } = require("../services-mysql/artists");
const { getNextAuctions } = require("../services-mysql/auctions");
const { getLastCollection } = require("../services-mysql/colletions");
const { getAllEventsWeekly, getNextEvents } = require("../services-mysql/events");
const { getAllObrasWeekly, getLastObra, getAllObrasByVisit } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var getDashboard = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await getUserName(data.user.id)

  const date = new Date();
  var hoy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var sieteDias = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 7
  );

  const transaccionesGeneral = await getAllObrasWeekly(sieteDias, hoy)
  var transaccionesTotal = 0;
  var ingresos = 0;

  if (transaccionesGeneral.length > 0) {
    transaccionesTotal = transaccionesGeneral.length;
    for (var i = 0; i < transaccionesGeneral.length; i++) {
      ingresos = transaccionesGeneral[i].precio + ingresos;
    }
  }

  const eventosGeneral = await getAllEventsWeekly(sieteDias, hoy)
  var eventos = 0;
  if (eventosGeneral.length > 0) {
    eventos = eventosGeneral.length;
  }

  const ultimaObra = await getLastObra()
  const galeria = await getAllArtistsByVisits()
  const ultimaColeccion = await getLastCollection()
  const obraVisitada = await getAllObrasByVisit()
  const artistasRelevantes = await getRelevantArtists()
  const proximasSubastas = await getNextAuctions()
  const proximosEventos = await getNextEvents()

  return {
    nombre,
    admin,
    transaccionesTotal,
    ingresos,
    eventos,
    proximosEventos,
    artistasRelevantes,
    proximasSubastas,
    ultimaObra,
    obraVisitada,
    ultimaColeccion,
    galeria,
    logueado,
    dashboard,
  };
};

module.exports = getDashboard;
