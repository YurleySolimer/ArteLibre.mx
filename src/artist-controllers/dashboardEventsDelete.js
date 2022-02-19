const pool = require("../database");

var dashboardEventsDelete = async (data) => {
    const { id } = data.params;

    await pool.query("DELETE from fotosEventos WHERE evento_id=?", [id]);
    await pool.query("DELETE from eventos WHERE id=?", [id]);
};

module.exports = dashboardEventsDelete;
