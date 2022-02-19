const pool = require("../database");

var artistDashboard = async (data) => {
  const artista = true;
  const logueado = true;
  const dashboard = true;

  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );
  const obras = await pool.query(
    "SELECT * FROM obras WHERE artista_id =? ORDER BY visitas DESC LIMIT 5",
    [data.user.id]
  );
  const colecciones = await pool.query(
    "SELECT * FROM colecciones WHERE artista_id =? ORDER BY visitas DESC LIMIT 5",
    [data.user.id]
  );
  const ultima_obra = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =? AND artista_id =? ORDER BY id DESC LIMIT 1",
    ["True", data.user.id]
  );
  const evento = await pool.query(
    "SELECT * FROM eventos WHERE artista_id =?  ORDER BY id DESC LIMIT 1",
    [data.user.id]
  );
  const subasta = await pool.query(
    "SELECT * FROM obraSubasta WHERE artista_id =?  ORDER BY id DESC LIMIT 1",
    [data.user.id]
  );
  var visitas = await pool.query(
    "SELECT visitas FROM artistas WHERE user_id =?",
    [data.user.id]
  );
  if (visitas.length > 0) {
    visitas = visitas[0].visitas;
  } else {
    visitas = 0;
  }

  return {
      artista,
      logueado,
      dashboard,
      nombre,
      obras,
      colecciones,
      ultima_obra,
      evento,
      subasta,
      visitas
  }
};

module.exports = artistDashboard;
