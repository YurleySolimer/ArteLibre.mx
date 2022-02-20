const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var fs = require("fs");

const helpers = require("./helpers");

const { getUsersByEmail, saveUser, getUser } = require("../services-mysql/users");
const { saveClient } = require("../services-mysql/clients");
const { saveArtist } = require("../services-mysql/artists");

passport.use(
  "signinUser",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, password, email, done) => {
      const email2 = req.body.email;
      const password2 = req.body.password;
      const rows = await getUsersByEmail(email2);

      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password2,
          user.password
        );
        console.log(validPassword);
        if (validPassword) {
          done(null, user, req.flash("success", "Welcome "));
        } else {
          done(null, false, req.flash("message", "Incorrect Password"));
        }
      } else {
        return done(
          null,
          false,
          req.flash("message", "The Username does not exists.")
        );
      }
    }
  )
);

//___________REGISTRO USUARIO CLIENTE____________//

passport.use(
  "signupCliente",
  new LocalStrategy(
    {
      usernameField: "fullname",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, fullname, password, done) => {
      const { email, apellido, telefono } = req.body;
      //const {path, originalname} = req.files[0];
      const noUser = await getUsersByEmail(email)

      if (noUser.length > 0) {
        return done(
          null,
          false,
          req.flash("message", "Error, este email ya está registrado")
        );
      } else {
        let newUser = {
          nombre: fullname,
          email,
          password,
          apellido,
          telefono,
          tipo: "Cliente",
        };

        newUser.password = await helpers.encryptPassword(password);
        const result = await saveUser(newUser)
        newUser.id = result.insertId;

        //-------------REGISTRO INFO DEL CLIENTE --------------//
        const { pais, region, provincia, fecha_nacimiento, direccion } =
          req.body;

        let newCliente = {
          pais,
          region,
          provincia,
          fecha_nacimiento,
          direccion,
          user_id: result.insertId,
        };

        const cliente = await saveClient(newCliente)

        return done(null, newUser);
      }
    }
  )
);

//___________REGISTRO USUARIO ARTISTA____________//

passport.use(
  "signupArtista",
  new LocalStrategy(
    {
      usernameField: "fullname",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, fullname, password, done) => {
      const { email, apellido, telefono } = req.body;
      var path = "";
      var originalname = "";

      if (req.body.image) {
        var img = req.body.image;
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

      const noUser2 = await getUsersByEmail(email)

      if (noUser2.length > 0) {
        return done(
          null,
          false,
          req.flash("message", "Error, este email ya está registrado")
        );
      } else {
        let newUser = {
          nombre: fullname,
          email,
          password,
          apellido,
          telefono,
          foto_ubicacion: path,
          foto_nombre: originalname,
          tipo: "Artista",
        };

        newUser.password = await helpers.encryptPassword(password);
        const result = await saveUser(newUser);
        newUser.id = result.insertId;

        //-------------REGISTRO INFO DEL ARTISTA --------------//
        const {
          pais,
          region,
          provincia,
          años,
          direccion,
          disciplina_principal,
          disciplina_sec,
          frase,
          biografia,
        } = req.body;

        let newArtista = {
          pais,
          region,
          provincia,
          años_experiencia: años,
          direccion,
          disciplina_principal,
          disciplina_sec,
          biografia,
          frase,
          user_id: result.insertId,
        };

        const artist = await saveArtist(newArtista)

        return done(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await getUser(id);
  done(null, rows[0]);
});
