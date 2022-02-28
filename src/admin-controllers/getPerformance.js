const { getUserName } = require("../services-mysql/users");
const {
  getClientsByRegion,
  getTotalClients,
  getTopClients,
  getTotalShoppers,
} = require("../services-mysql/clients");
const {
  getAllPrices,
  getAllObras,
  getAllObrasSold,
} = require("../services-mysql/obras");
const { getTopArtists, getTotalArtists } = require("../services-mysql/artists");

var getPerformance = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = true;
      const logueado = true;
      const nombre = await getUserName(data.user.id);

      const clientesRegion = await getClientsByRegion();
      const clientesDestacados = await getTopClients();
      const clientesTotal = await getTotalClients();
      const compradoresTotal = await getTotalShoppers();
      var compradoresTasa = 0;
      if (clientesTotal.length > 0 && compradoresTotal.length > 0) {
        compradoresTasa =
          (compradoresTotal.length / clientesTotal.length) * 100;
      }
      const obrasTotal = await getAllPrices();
      var precioSuma = 0;
      if (obrasTotal.length > 0) {
        for (var i = 0; i < obrasTotal.length; i++) {
          precioSuma = obrasTotal[i].precio + precioSuma;
        }
        var precioPromedio = precioSuma / obrasTotal.length;
      }

      const artistasDestacados = await getTopArtists();
      const obrasSuma = await getAllObras();
      const artistasSuma = await getTotalArtists();
      var promArtistasObra = 0;
      if (obrasSuma.length > 0 && artistasSuma.length > 0) {
        promArtistasObra = obrasSuma.length / artistasSuma.length;
      }

      const totalGanancia = await getAllObrasSold();
      var promGanancia = 0;
      var sumGanancia = 0;
      if (totalGanancia.length > 0) {
        for (var j = 0; j < totalGanancia.length; j++) {
          sumGanancia = totalGanancia[j].precio + sumGanancia;
        }
        promGanancia = (sumGanancia / totalGanancia.length) * 0.85;
      }

      return resolve({
        nombre,
        admin,
        precioPromedio,
        promArtistasObra,
        promGanancia,
        logueado,
        dashboard,
        clientesRegion,
        artistasDestacados,
        compradoresTasa,
        clientesDestacados,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getPerformance;
