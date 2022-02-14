const express = require("express");
const router = express.Router();
const helpers = require("../lib/helpers");

const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

const recuperarPass = require("../auth-controllers/recoveryPass");
const code = require("../auth-controllers/validateCode");
const changePass = require("../auth-controllers/changePass");

var email = "";

router.get("/registro-cliente", (req, res) => {
  res.render("auth/registroCliente");
});

router.post(
  "/registro-cliente",
  passport.authenticate("signupCliente", {
    successRedirect: "/obras",
    failureRedirect: "/registro-cliente",
    failureFlash: true,
  })
);

router.get("/registro-artista", (req, res) => {
  res.render("auth/registroArtista");
});

router.post(
  "/registro-artista",
  passport.authenticate("signupArtista", {
    successRedirect: "/artistas",
    failureRedirect: "/registro-artista",
    failureFlash: true,
  })
);

router.get("/iniciar-sesion", isNotLoggedIn, (req, res) => {
  res.render("auth/signin");
});

router.post("/iniciar-sesion", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("signinUser", {
    successRedirect: "/",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect("/iniciar-sesion");
});

router.post("/recuperar-contrasena", async (req, res) => {
  const result = recuperarPass(req.body);
  email = req.body.email
  if (result) {
    req.flash("success", "Código enviado Satisfactoriamente");
    return res.redirect("validacion-de-codigo/?email=" + email);
  } else {
    req.flash("message", "No hay ningún usuario asociado a ese correo");
    res.redirect("iniciar-sesion");
  }
});

router.get("/validacion-de-codigo", isNotLoggedIn, (req, res) => {
  res.render("auth/codigo");
});

router.post("/validacion-de-codigo", async (req, res) => {
  const codeResult = code(req.body);
  if (codeResult === "true") {
    res.redirect("/cambio-de-contrasena/?param=" + email);
  } else if (codeResult === "expirado") {
    req.flash("message", "El código ha expirado");
    res.redirect("/iniciar-sesion");
  } else {
    req.flash("message", "Código Inválido");
    res.redirect("/validacion-de-codigo");
  }
});

router.get("/cambio-de-contrasena", isNotLoggedIn, (req, res) => {
  res.render("auth/nuevaContra");
});

router.post("/cambio-de-contrasena", async (req, res) => {
  changePass(req.body, email)
  req.flash("success", "Contraseña cambiada Satisfactoriamente");
  email = "";
  res.redirect("iniciar-sesion");
});

module.exports = router;
