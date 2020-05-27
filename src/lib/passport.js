const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('signinUser', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, password, email, done) => {
  const email2 = req.body.email;
  const password2 = req.body.password;
  console.log(req.body);

  const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email2]);
  console.log(rows);

  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password2, user.password)
    console.log(validPassword)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome '));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

//___________REGISTRO USUARIO CLIENTE____________//

passport.use('signupCliente', new LocalStrategy({
  usernameField: 'fullname',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, fullname, password, done) => {
 
  const {email, apellido, telefono} = req.body;
  //const {path, originalname} = req.files[0];
  const noUser = await pool.query('SELECT * FROM users WHERE email =?', [email]);

  if (noUser.length>0) {
    return done(null, false, req.flash('message', 'Error, este email ya está registrado'));

  } else {

  let newUser = {
    nombre: fullname,
    email, 
    password,
    apellido,
    telefono,
    tipo: 'Cliente'
  };

  newUser.password = await helpers.encryptPassword(password);
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;

    //-------------REGISTRO INFO DEL CLIENTE --------------//
    const {pais, region, provincia, fecha_nacimiento, direccion} = req.body;

    let newCliente = {
      pais,
      region, 
      provincia,
      fecha_nacimiento,
      direccion,
      user_id: result.insertId
    };
  
    const cliente = await pool.query('INSERT INTO clientes SET ? ', newCliente);
    console.log(newUser);
    console.log(newCliente);
    return done(null, newUser);
  }
}));

//___________REGISTRO USUARIO ARTISTA____________//

passport.use('signupArtista', new LocalStrategy({
  usernameField: 'fullname',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, fullname, password, done) => {
  console.log('Hola');
 
  const {email, apellido, telefono} = req.body;
  var path = '';
  var originalname = '';

  if(req.files[0]) {
    path = req.files[0].path,
    originalname = req.files[0].originalname
  }
  const noUser2 = await pool.query('SELECT * FROM users WHERE email =?', [email]);

  if (noUser2.length>0) {
    return done(null, false, req.flash('message', 'Error, este email ya está registrado'));

  } else {

  let newUser = {
    nombre: fullname,
    email, 
    password,
    apellido,
    telefono,
    foto_ubicacion : path,
		foto_nombre: originalname,
    tipo: 'Artista'
  };

  newUser.password = await helpers.encryptPassword(password);
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;

    //-------------REGISTRO INFO DEL ARTISTA --------------//
    const {pais, region, provincia, años, direccion, disciplina_principal, disciplina_sec, frase, biografia} = req.body;

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
      user_id: result.insertId
    };
  
    const artist = await pool.query('INSERT INTO artistas SET ? ', newArtista);
    console.log(newUser);
    console.log(newArtista); 
    return done(null, newUser);
  }
}));
 
 



passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
	const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
	done(null, rows[0]);
});