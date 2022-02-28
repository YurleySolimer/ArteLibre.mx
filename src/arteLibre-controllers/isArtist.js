const { getUserType } = require("../services-mysql/users");

var isArtist = async (data) => {
  try {
    if (data.isAuthenticated()) {
      var usuario = await getUserType(data.user.id)
  
      if (usuario[0].tipo == "Artista") {
        logueado = true;
        return true;
      }
      return false;
    } else {
      logueado = false;
      return false;
    }
  } catch (error) {
    return error
  }
};

module.exports = isArtist;
