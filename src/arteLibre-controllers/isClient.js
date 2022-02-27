const { getUserType } = require("../services-mysql/users");

var isClient = async (data) => {
  if (data.isAuthenticated()) {
    var usuario = await getUserType(data.user.id)

    if (usuario[0].tipo == "Cliente") {
      logueado = true;
      return true;
    }
    return false;
  } else {
    logueado = false;
    return false;
  }
};

module.exports = isClient;
