const pool = require("../database");

var isAdmin = async (data) => {
  if (data.isAuthenticated()) {
    var usuario = await pool.query("SELECT tipo FROM users WHERE id =?", [
      data.user.id,
    ]);

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
