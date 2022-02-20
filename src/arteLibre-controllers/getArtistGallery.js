const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getArtistGallery = async (data) => {
  artista = await isArtist(data);
  cliente = await isClient(data);
  admin = await isAdmin(data);
  var nombre = ''

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  const user = await pool.query("SELECT * FROM usuarioArtista WHERE id =?", [
    data.params.id,
  ]);
  const obras1 = await pool.query(
    "SELECT * FROM obraCompleta WHERE artista_id =? AND galeria =? ORDER BY id ASC ",
    [data.params.id, "Si"]
  );
  const obras2 = await pool.query(
    "SELECT * FROM obraCompleta WHERE artista_id =? AND galeria =? ORDER BY id DESC ",
    [data.params.id, "Si"]
  );

  var visitasArray = await pool.query(
    "SELECT visitasGaleria from artistas WHERE user_id =?",
    [data.params.id]
  );
  var visitasTotal = visitasArray[0].visitasGaleria + 1;
  var visitasGaleria = {
    visitasGaleria: visitasTotal,
  };
  await pool.query("UPDATE artistas  SET ? WHERE user_id =?", [
    visitasGaleria,
    data.params.id,
  ]);

  return {
    user,
    obras1,
    obras2,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  }
};

module.exports = getArtistGallery;
