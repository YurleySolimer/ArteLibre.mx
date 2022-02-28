const { getUserName } = require("../services-mysql/users");

var getSales = async (data) => {
  try {
    const admin = true;
    const logueado = true;
    const nombre = await getUserName(data.user.id);

    return { nombre, admin, logueado, dashboard };
  } catch (error) {
    return error;
  }
};

module.exports = getSales;
