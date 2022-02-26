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

var getAllEvents = async (id) => {
  //
  const event = await pool.query("select * from eventos where artista_id =? ", [
    id,
  ]);
  return event;
};

var getAllEventsCompleted = async () => {
  //
  const event = await pool.query("SELECT * FROM eventoCompleto");
  return event;
};

var updateEvent = async (data, id) => {
  //update data event
  const event = await pool.query("UPDATE eventos SET ? WHERE id =?", [
    data,
    id,
  ]);
  return event;
};

var saveEvent = async (data) => {
  //insert newEvent
  const event = await pool.query("UPDATE eventos SET ? WHERE id =?", [
    data,
    id,
  ]);
  return event;
};

var saveEventsPics = async (data) => {
  //insert newEvent
  const event = await pool.query("INSERT INTO fotosEventos SET?", [data]);
  return event;
};

var getEventById = async (id) => {
  const event = await pool.query("SELECT * FROM eventos WHERE id =?", [id]);
  return event;
};

var getEventPics = async (id) => {
  const event = await pool.query(
    "SELECT * FROM fotosEventos WHERE evento_id =?",
    [id]
  );
  return event;
};

var getEventVisits = async (id) => {
  const event = await pool.query("SELECT visitas from eventos WHERE id =?", [
    id,
  ]);
  return event;
};

var getAllEventsWeekly = async (date, today) => {
  //Get events in a week
  const events = await pool.query(
    "select * from eventos where fecha_inicio between ? and ?",
    [sieteDias, hoy]
  );
  return events;
};

var getNextEvents = async () => {
  const event = await pool.query(
    "select * from eventos order by fecha_inicio desc limit 3 "
  );

  return event;
};

module.exports = {
  getEvents,
  getLastArtistEvent,
  getArtistEvents,
  getFotos,
  deleteEvent,
  deleteEventPics,
  getAllEvents,
  updateEvent,
  saveEvent,
  saveEventsPics,
  getEventById,
  getEventPics,
  getEventVisits,
  getAllEventsCompleted,
  getAllEventsWeekly,
  getNextEvents
};
