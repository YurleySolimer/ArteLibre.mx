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

var getArtistEvents = async (id) => {
  //get last event
  const event = await pool.query(
    "SELECT * from eventoCompleto WHERE userID =?",
    [id]
  );
  return event;
};

var getFotos = async () => {
  //get all pics
  const fotos = await pool.query("SELECT * FROM fotosEventos");
  return fotos;
};

var deleteEvent = async (id) => {
  //delete and event
  const event = await pool.query("DELETE from fotosEventos WHERE evento_id=?", [
    id,
  ]);
  return event;
};

var deleteEventPics = async (id) => {
  //delete all event pics
  const event = await pool.query("DELETE from eventos WHERE id=?", [id]);
  return event;
};

module.exports = {
  getEvents,
  getLastArtistEvent,
  getArtistEvents,
  getFotos,
  deleteEvent,
  deleteEventPics,
};
