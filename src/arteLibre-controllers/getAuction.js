const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getAuction = async (data) => {
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  const subasta = await pool.query("SELECT * FROM obraSubasta WHERE id =?", [
    data.params.id,
  ]);

  const obraId = subasta[0].obraId;
  const fotos = await pool.query("SELECT * FROM fotosObras WHERE obra_id =?", [
    obraId,
  ]);
  
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =?",
    ["True"]
  );

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
    artista,
    cliente,
    myArray,
    logueado,
    admin,
    subasta,
    fotos,
    nombre,
  };
};
module.exports = getAuction;
