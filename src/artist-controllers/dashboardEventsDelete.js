const { deleteEvent, deleteEventPics } = require("../services-mysql/events");

var dashboardEventsDelete = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = data.params;
      await deleteEvent(id);
      await deleteEventPics(id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = dashboardEventsDelete;
