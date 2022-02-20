const pool = require("../database");

var getEvents = async () => {
  //get the first 8 events
  const event = await pool.query("SELECT * FROM eventoCompleto LIMIT 8");
  return event;
};

var getLastArtistEvent = async (id) => {
  //get last event
  const event = await pool.query(
    "SELECT * FROM eventos WHERE artista_id =?  ORDER BY id DESC LIMIT 1",
    [id]
  );
  return event;
};

module.exports = {
  getEvents,
  getLastArtistEvent,
};
