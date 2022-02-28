var fs = require("fs");
const { updateUserById } = require("../services-mysql/users");
const { updateArtist } = require("../services-mysql/artists");

var editProfile = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { fullname, email, apellido, telefono } = data.body;
      var path = "";
      var originalname = "";

      if (data.body.image) {
        var img = data.body.image;
        // luego extraes la cabecera del data url
        var base64Data = img.replace(/^data:image\/png;base64,/, "");
        var path = `src/public/uploads/${fullname}${email}.png`;
        var originalname = `${fullname}${email}.png`;

        // grabas la imagen el disco
        fs.writeFile(
          `src/public/uploads/${fullname}${email}.png`,
          base64Data,
          "base64",
          function (err) {
            console.log(err);
          }
        );
      }

      let newUser = {
        nombre: fullname,
        email,
        apellido,
        telefono,
        foto_ubicacion: path,
        foto_nombre: originalname,
      };

      const result = await updateUserById(newUser, data.body.idArtist);

      const {
        pais,
        region,
        provincia,
        años,
        direccion,
        disciplina_principal,
        estilo,
        frase,
        biografia,
      } = data.body;

      let newArtista = {
        pais,
        region,
        provincia,
        años_experiencia: años,
        direccion,
        disciplina_principal,
        biografia,
        frase,
      };

      const artist = await updateArtist(newArtista, data.body.idArtist);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = editProfile;
