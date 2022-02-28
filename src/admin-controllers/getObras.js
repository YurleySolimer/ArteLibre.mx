const { getAllObrasCompleted } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var getObras = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = true;
      const logueado = true;
      var obras = await getAllObrasCompleted;
      const nombre = await getUserName(data.user.id);

      return resolve({
        nombre,
        admin,
        logueado,
        dashboard,
        obras,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getObras;
