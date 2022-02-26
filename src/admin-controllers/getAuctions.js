const { getAllAuctions } = require("../services-mysql/auctions");
const { getUserName } = require("../services-mysql/users");

var getAuctions = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await getUserName(data.user.id)

  var obras = await getAllAuctions()
  return {
    nombre,
    admin,
    logueado,
    dashboard,
    obras,
  };
};

module.exports = getAuctions;
