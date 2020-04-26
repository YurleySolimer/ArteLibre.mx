const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('user.signin', new LocalStrategy({
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

//_______________________//

passport.use('user.signup', new LocalStrategy({
  usernameField: 'fullname',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, fullname, password, done) => {

  const {email} = req.body;

  let newUser = {
    fullname,
    email, 
    password
  };

  newUser.password = await helpers.encryptPassword(password);
  newUser.email = req.body.email;
  console.log(fullname);
  console.log(email);
  console.log(password)
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;





 return done(null, newUser);
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
	const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
	done(null, rows[0]);
});