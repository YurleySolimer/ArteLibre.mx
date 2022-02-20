const pool = require("../database");

var getUser = async (id) => {
  //Get an user by ID
  const user = await pool.query("SELECT * FROM users WHERE id =?", id);
  return user;
};

var getUsersByEmail = async (email) => {
  //Get all user by an email
  const users = await pool.query("SELECT * FROM users WHERE email = ?", email);
  return users;
};

var getUserName = async (id) => {
  //Get name from user by id
  const name = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    id
  );
  return name;
};

var saveUser = async (newUser) => {
  //Save a new user in DB
  const user = await pool.query("INSERT INTO users SET ? ", newUser);
  return user;
};

module.exports = {
  getUser,
  getUsersByEmail,
  getUserName,
  saveUser,
};