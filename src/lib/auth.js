const { getUser } = require("../services-mysql/users");

const isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    //true si la sesión del usuario existe
    return next();
  }
  return res.redirect("/iniciar-sesion");
};
const isCliente = async (req, res, next) => {
  var user = await getUser(req.user.id);
  if (user[0].tipo == "Cliente") {
    return next();
  }
  return res.redirect("/");
};

const isArtista = async (req, res, next) => {
  var user = await getUser(req.user.id);
  if (user[0].tipo == "Artista") {
    return next();
  }
  return res.redirect("/");
};

const isAdmin = async (req, res, next) => {
  var user = await getUser(req.user.id);
  if (user[0].tipo == "Admin") {
    return next();
  }
  return res.redirect("/");
};

const isNotLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
};

module.exports = {
  isLoggedIn,
  isAdmin,
  isCliente,
  isArtista,
  isNotLoggedIn,
};
