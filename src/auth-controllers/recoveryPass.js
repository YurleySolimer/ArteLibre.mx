const pool = require("../database");
const newToken = require("./createToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

var email = "";

const emailAdmin = process.env.ADMIN_EMAIL;
const passAdmin = process.env.ADMIN_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  secure: true, // true for 465, false for other ports
  auth: {
    type: "login",
    user: emailAdmin,
    pass: passAdmin,
  },
});

const recuperarPass = async (data) => {
  email = data.email;
  const usuario = await pool.query("SELECT * FROM users WHERE email =?", [
    email,
  ]);
  if (usuario.length > 0) {
    const token = newToken(req.body);

    await pool.query("INSERT INTO ResetTokens set?", [token]);
    var mailOptions = {
      from: "Arte Libre  <noreply@artelibre.mx>",
      to: email,
      subject: "Arte Libre: Recuperar Contraseña",
      text: "Código de validación: " + encodeURIComponent(token.token),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      console.log("senMail returned!");
      if (error) {
        console.log("ERROR!!!!!!", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return true
  } else {
    return false
  }
};

module.exports = recuperarPass
