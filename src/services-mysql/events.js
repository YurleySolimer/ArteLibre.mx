const pool = require("../database");

var getEvents = async () => {
  //get the first 8 events
  const event = await pool.query("SELECT * FROM eventoCompleto LIMIT 8");
  return event;
};

module.exports = {
  getEvents,
};
