const crypto = require("crypto");

var newToken = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      var token = crypto.randomBytes(4).toString("hex");
      var created = new Date();
      var expireDate = new Date();

      expireDate.setMinutes(expireDate.getMinutes() + 60); //Token expira en una hora

      return reject({
        email: data.email,
        expiration: expireDate,
        token: token,
        createdAt: created,
        used: 0,
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = newToken;
