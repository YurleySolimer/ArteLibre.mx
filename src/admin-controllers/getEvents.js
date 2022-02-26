const { getAllEventsCompleted } = require("../services-mysql/events");
const { getUserName } = require("../services-mysql/users");

var getEvents = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await getUserName(data.user.id)
  const eventos = await getAllEventsCompleted()

  return {
    nombre: nombre[0],
    admin,
    logueado,
    dashboard,
    eventos,
  };
};

module.exports = getEvents;
