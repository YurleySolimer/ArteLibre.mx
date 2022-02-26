const { getUserType } = require("../services-mysql/users");

var isAdmin = async (data) => {
  if (data.isAuthenticated()) {
    var usuario = await getUserType(data.user.id)

    if (usuario[0].tipo == "Admin") {
      logueado = true;
      return true;
    }
    return false;
  } else {
    logueado = false;
    return false;
  }
};

module.exports = isAdmin;
