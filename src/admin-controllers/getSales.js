const { getUserName } = require("../services-mysql/users");

var getSales = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await getUserName(data.user.id)

  return { nombre, admin, logueado, dashboard };
};

module.exports = getSales;
