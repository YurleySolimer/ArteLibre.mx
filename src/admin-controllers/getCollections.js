const { getAllCollections } = require("../services-mysql/colletions");
const { getUserName } = require("../services-mysql/users");

var getCollections = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await getUserName(data.user.id)

  const colecciones = await getAllCollections()
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    colecciones,
  };
};

module.exports = getCollections;
