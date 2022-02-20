const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getObra = async (data) => {
  const id = data.params.id;
  const obra = await pool.query("SELECT * FROM obraCompleta WHERE id =?", [
    data.params.id,
  ]);
  const fotos = await pool.query("SELECT * FROM fotosObras WHERE obra_id=?", [
    data.params.id,
  ]);
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =?",
    ["True"]
  );

  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);
  var nombre = ''

  var visitasArray = await pool.query("SELECT visitas from obras WHERE id =?", [
    id,
  ]);
  if (visitasArray.length > 0) {
    var visitasTotal = visitasArray[0].visitas + 1;
    var visitas = {
      visitas: visitasTotal,
    };
    await pool.query("UPDATE obras  SET ? WHERE id =?", [visitas, id]);
  }

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  var myArray = [];
  for (var i = 0; i < 3; i++) {
    var numeroAleatorio = Math.ceil(Math.random() * obras.length);
    var existe = false;
    for (var j = 0; j < myArray.length; j++) {
      if (myArray[j] == obras[numeroAleatorio - 1]) {
        existe = true;
      }
    }
    if (existe == false) {
      myArray[i] = obras[numeroAleatorio - 1];
    }
  }

  return {
    obra,
    fotos,
    myArray,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};

module.exports = getObra;
