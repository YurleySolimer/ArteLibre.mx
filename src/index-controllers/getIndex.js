const pool = require("../database");
const isArtist = require("../arteLibre-controllers/isArtist");
const isAdmin = require("../arteLibre-controllers/isAdmin");
const isClient = require("../arteLibre-controllers/isClient");
const { getUserName } = require("../services-mysql/users");
const { getNotableObra, getNotableObras, getFirstArtistObra, getLastArtistObra, getObrasFromCollection } = require("../services-mysql/obras");
const { getNotableArtist } = require("../services-mysql/artists");
const { getNotableCollection } = require("../services-mysql/colletions");
const { getEvents } = require("../services-mysql/events");

var getIndex = async (data) => {
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);
  var nombre = ''

  if (artista == true || cliente == true || admin == true) {
    nombre = await getUserName(data.user.id)
  }

  var obra_destacada = await getNotableObra()
  var destacadas = await getNotableObras()

  var artista_destacado = await getNotableArtist()

  if (artista_destacado.length > 0) {
    var id_artista = artista_destacado[0].id;
    var obra1_artista = await getFirstArtistObra(id_artista)
    var obra2_artista = await getLastArtistObra(id_artista)
  }

  const eventos = await getEvents();
  const coleccion_destacada = await getNotableCollection()
  var obras_coleccion = [];
  if (coleccion_destacada.length > 0) {
    obras_coleccion = await getObrasFromCollection(coleccion_destacada)
  }
  return {
    artista,
    admin,
    nombre,
    cliente,
    logueado,
    eventos,
    coleccion_destacada,
    obras_coleccion,
    obra_destacada,
    destacadas,
    obra1_artista,
    obra2_artista,
    artista_destacado,
  };
};

module.exports = getIndex;
