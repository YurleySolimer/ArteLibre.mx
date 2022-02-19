const pool = require("../database");

var dashboardEvents = async (data) => {
    const nombre = await pool.query(
        "SELECT nombre, apellido FROM users WHERE id =?",
        [data.user.id]
      );
      const artista = true;
      const logueado = true;
      const dashboard = true;
      const eventos = await pool.query(
        "SELECT * from eventoCompleto WHERE userID =?",
        [data.user.id]
      );
      const fotos = await pool.query("SELECT * FROM fotosEventos");

      return {
          nombre,
          artista,
          logueado,
          dashboard,
          eventos,
          fotos
      }
};
module.exports = dashboardEvents;
