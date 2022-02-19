const pool = require("../database");

var dashboardNewCollection = async (data) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
 const artista = true;
 const logueado = true;
 const dashboard = true;

 return {
     nombre,
     artista,
     logueado,
     dashboard
 }
};

module.exports = dashboardNewCollection;
