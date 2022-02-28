const { getVisits } = require("../services-mysql/artists");
const { getLastArtistAuction } = require("../services-mysql/auctions");
const { getFiveArtistsCollections } = require("../services-mysql/colletions");
const { getLastArtistEvent } = require("../services-mysql/events");
const {
  getFiveArtistObras,
  getLastArtistObra,
} = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var artistDashboard = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const artista = true;
      const logueado = true;
      const dashboard = true;

      const nombre = await getUserName(data.user.id);
      const obras = await getFiveArtistObras(data.user.id);
      const colecciones = await getFiveArtistsCollections(data.user.id);
      const ultima_obra = await getLastArtistObra(data.user.id);
      const evento = await getLastArtistEvent(data.user.id);
      const subasta = await getLastArtistAuction(data.user.id);
      var visitas = await getVisits(data.user.id);
      if (visitas.length > 0) {
        visitas = visitas[0].visitas;
      } else {
        visitas = 0;
      }

      return resolve({
        artista,
        logueado,
        dashboard,
        nombre,
        obras,
        colecciones,
        ultima_obra,
        evento,
        subasta,
        visitas,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = artistDashboard;
