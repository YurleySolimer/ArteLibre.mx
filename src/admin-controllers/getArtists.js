const { getAllArtists } = require("../services-mysql/artists");
const { getUserName } = require("../services-mysql/users");

var getArtists = async (data) => {
  var artistasCompletos = await getAllArtists()

  const admin = true;
  const logueado = true;

  const nombre = await getUserName(data.user.id)
  
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    artistasCompletos,
  };
};

module.exports = getArtists;
