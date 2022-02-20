const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getArtist = async (data) => {
  const id = data.params.id;

  const user = await pool.query("SELECT * FROM usuarioArtista WHERE id =?", [
    id,
  ]);
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE artista_id =?",
    [id]
  );
  const colecciones = await pool.query(
    "SELECT * FROM colecciones WHERE artista_id =?",
    [id]
  );
  const eventos = await pool.query(
    "SELECT * FROM eventos WHERE artista_id =?",
    [id]
  );

  var ultima_obra = {
    nombreObra: "N/A",
  };
  if (obras.length > 0) {
    ultima_obra = obras[obras.length - 1];
  }

  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);
  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  var visitasArray = await pool.query(
    "SELECT visitas from artistas WHERE user_id =?",
    [id]
  );
  if (visitasArray.length > 0) {
    var visitasTotal = visitasArray[0].visitas + 1;
    var visitas = {
      visitas: visitasTotal,
    };
    await pool.query("UPDATE artistas  SET ? WHERE user_id =?", [visitas, id]);
  }

  return {
    user,
    colecciones,
    eventos,
    obras,
    ultima_obra,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};

module.exports = getArtist;
