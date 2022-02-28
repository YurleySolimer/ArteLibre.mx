const { getAllEventsCompleted } = require("../services-mysql/events");
const { getUserName } = require("../services-mysql/users");

var getEvents = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = true;
      const logueado = true;
      const nombre = await getUserName(data.user.id);
      const eventos = await getAllEventsCompleted();

      return resolve({
        nombre: nombre[0],
        admin,
        logueado,
        dashboard,
        eventos,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getEvents;
