const { getUserName } = require("../services-mysql/users");

var getNewCollection = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nombre = await getUserName(data.user.id);
      const artista = true;
      const logueado = true;

      return resolve({
        nombre,
        artista,
        logueado,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getNewCollection;
