const pool = require("../database");

var deleteToken = async (email) => {
  //Delete token created
  const token = await pool.query(
    "DELETE FROM ResetTokens WHERE email =?",
    email
  );
  return token;
};

var saveToken = async (token) => {
  //Save a new token
  const tokenResult = await pool.query("INSERT INTO ResetTokens set?", token);
  return tokenResult;
};

var getToken = async (token) => {
  //Get an user token
  const tokenResult = await pool.query(
    "SELECT * FROM ResetTokens WHERE token =?",
    [token]
  );
  return tokenResult;
};

module.exports = {
  deleteToken,
  saveToken,
  getToken,
};
