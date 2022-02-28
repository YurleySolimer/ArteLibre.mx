const pool = require("../database");
const { getUserName } = require("../services-mysql/users");

var getRates = async (data) => {
  try {
    const admin = true;
    const logueado = true;
    const nombre = await getUserName(data.user.id);

    return {
      nombre,
      logueado,
      dashboard,
      admin,
    };
  } catch (error) {
    return error;
  }
};

module.exports = getRates;
