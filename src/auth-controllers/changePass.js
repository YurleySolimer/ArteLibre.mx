const nodemailer = require("nodemailer");
const { deleteToken } = require("../services-mysql/tokens");
const { updateUserByEmail } = require("../services-mysql/users");

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
const changePass = async (data, email) => {
    await deleteToken(email)
    const { password } = data;
    const passw = {
      password: password,
    };
    passw.password = await helpers.encryptPassword(password);
    const act = await updateUserByEmail(passw, email)
  
    var mailOptions = {
      from: "Arte Libre  <norepply@artelibre.mx>",
      to: email,
      subject: "Arte Libre: Cambio de Contraseña",
      text: "Su contraseña ha sido cambiada exitosamente",
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      console.log("senMail returned!");
      if (error) {
        console.log("ERROR!!!!!!", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  
}

module.exports = changePass;