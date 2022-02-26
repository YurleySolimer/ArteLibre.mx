const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");
const { getUserName } = require("../services-mysql/users");
const {
  getAllAuctions,
  updateAuctionsInfo,
} = require("../services-mysql/auctions");

var getAuctions = async (data) => {
  artista = await isArtist(data);
  cliente = await isClient(data);
  admin = await isAdmin(data);
  var nombre = "";

  if (artista == true || cliente == true || admin == true) {
    nombre = await getUserName(data.user.id);
  }
  const obras = await getAllAuctions();
  if (obras.length > 0) {
    for (var i = 0; i < obras.length; i++) {
      const fecha = obras[i].fecha_inicio;
      const datetime1 = new Date();

      const hora_inicio = obras[i].hora_inicio;
      const hora = (hora_inicio[0] + hora_inicio[1]) * 1;
      const minutos = (hora_inicio[3] + hora_inicio[4]) * 1;
      fecha.setHours(hora, minutos);

      var fecha2 = new Date(
        datetime1.getFullYear(),
        datetime1.getMonth(),
        datetime1.getDate(),
        datetime1.getHours(),
        datetime1.getMinutes()
      );

      var fecha_final = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
        fecha.getHours(),
        fecha.getMinutes()
      );
      const hora_final = obras[i].duracion * 1;
      fecha_final.setHours(hora + hora_final);

      if (
        fecha.getTime() <= fecha2.getTime() &&
        fecha2.getTime() < fecha_final.getTime()
      ) {
        var tiempo_restante =
          (fecha_final.getTime() - fecha2.getTime()) / 1000 / 60 / 60;
        tiempo_restante = tiempo_restante.toFixed(2);
        const estadoSubasta = {
          estadoSubasta: "En Proceso",
          tiempo_restante,
        };
        await updateAuctionsInfo(estadoSubasta, obras[i].obraId);
      }

      if (fecha_final.getTime() <= fecha2.getTime()) {
        const estadoSubasta = {
          estadoSubasta: "Finalizada",
        };
        await updateAuctionsInfo(estadoSubasta, obras[i].obraId);
      }
    }
  }

  return {
    artista,
    cliente,
    logueado,
    admin,
    nombre,
    obras,
  };
};
module.exports = getAuctions;
