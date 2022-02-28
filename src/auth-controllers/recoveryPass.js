const newToken = require("./createToken");
const nodemailer = require("nodemailer");
const { getUsersByEmail } = require("../services-mysql/users");
const { saveToken } = require("../services-mysql/tokens");

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
  return new Promise(async (resolve, reject) => {
    try {
      email = data.email;
      const usuario = await getUsersByEmail(email);
      if (usuario.length > 0) {
        const token = newToken(data.body);
        await saveToken(token);
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

        return true;
      } else {
        return false;
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = recuperarPass;
