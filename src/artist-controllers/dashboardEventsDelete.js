const { deleteEvent, deleteEventPics } = require("../services-mysql/events");

var dashboardEventsDelete = async (data) => {
    const { id } = data.params;

    await deleteEvent(id)
    await deleteEventPics(id)
};

module.exports = dashboardEventsDelete;
