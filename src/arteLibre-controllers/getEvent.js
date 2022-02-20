const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getEvent = async (data) => {
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

  const evento = await pool.query("SELECT * FROM eventos WHERE id =?", [
    data.params.id,
  ]);
  const fotos = await pool.query(
    "SELECT * FROM fotosEventos WHERE evento_id =?",
    [data.params.id]
  );

  var visitasArray = await pool.query(
    "SELECT visitas from eventos WHERE id =?",
    [data.params.id]
  );
  var visitasTotal = visitasArray[0].visitas + 1;
  var visitas = {
    visitas: visitasTotal,
  };
  await pool.query("UPDATE eventos SET ? WHERE id =?", [
    visitas,
    data.params.id,
  ]);

  return {
    evento,
    fotos,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};
module.exports = getEvent;
