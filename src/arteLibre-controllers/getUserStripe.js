const pool = require("../database");

var getUserStripe = async (data) => {
   var userStripe = await pool.query(
        "SELECT * FROM artistStripe WHERE id_user =? LIMIT 1",
        [obra[0].artista_id]
      );

  return {
    userStripe,
  };
};

module.exports = getUserStripe;
