const { getAllAuctions } = require("../services-mysql/auctions");
const { getUserName } = require("../services-mysql/users");

var getAuctions = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = true;
      const logueado = true;
      const nombre = await getUserName(data.user.id);

      var obras = await getAllAuctions();
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

module.exports = getAuctions;
