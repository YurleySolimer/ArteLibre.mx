const crypto = require('crypto');

var newToken = (data) => {
  var token = crypto.randomBytes(4).toString("hex");
  var created = new Date();
  var expireDate = new Date();

  expireDate.setMinutes(expireDate.getMinutes() + 60); //Token expira en una hora

  return {
    email: data.email,
    expiration: expireDate,
    token: token,
    createdAt: created,
    used: 0,
  };
};

module.exports = newToken
