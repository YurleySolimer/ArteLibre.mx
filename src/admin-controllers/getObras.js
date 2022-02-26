const { getAllObrasCompleted } = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var getObras = async (data) => {
  const admin = true;
  const logueado = true;
  var obras = await getAllObrasCompleted
  const nombre = await getUserName(data.user.id)

  return {
    nombre,
    admin,
    logueado,
    dashboard,
    obras,
  };
};

module.exports = getObras;
