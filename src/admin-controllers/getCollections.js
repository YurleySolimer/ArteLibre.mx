const { getAllCollections } = require("../services-mysql/colletions");
const { getUserName } = require("../services-mysql/users");

var getCollections = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = true;
      const logueado = true;
      const nombre = await getUserName(data.user.id);

      const colecciones = await getAllCollections();
      return resolve({
        nombre,
        admin,
        logueado,
        dashboard,
        colecciones,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getCollections;
