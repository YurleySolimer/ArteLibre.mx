const pool = require("../database");
const isArtist = require("./isArtist");
const isAdmin = require("./isAdmin");
const isClient = require("./isClient");

var getCollection = async (data) => {
  const id = data.params.id;
  const artista = await isArtist(data);
  const cliente = await isClient(data);
  const admin = await isAdmin(data);

  if (artista == true || cliente == true || admin == true) {
    nombre = await pool.query(
      "SELECT nombre, apellido FROM users WHERE id =?",
      [data.user.id]
    );
  }

  var obras = [];
  const colecciones = await pool.query(
    "SELECT * from coleccionArtista WHERE id =?",
    [id]
  );
  if (colecciones.length > 0) {
    obras = await pool.query(
      "SELECT * FROM obraCompleta WHERE coleccion_id =?",
      [id]
    );
  }

  var visitasArray = await pool.query(
    "SELECT visitas from colecciones WHERE id =?",
    [id]
  );
  var visitasTotal = visitasArray[0].visitas + 1;
  var visitas = {
    visitas: visitasTotal,
  };
  await pool.query("UPDATE colecciones  SET ? WHERE id =?", [visitas, id]);

  const obras2 = await pool.query(
    "SELECT * FROM obraCompleta WHERE principal =?",
    ["True"]
  );

  var myArray = [];
  for (var i = 0; i < 3; i++) {
    var numeroAleatorio = Math.ceil(Math.random() * obras2.length);
    var existe = false;
    for (var j = 0; j < myArray.length; j++) {
      if (myArray[j] == obras[numeroAleatorio - 1]) {
        existe = true;
      }
    }
    if (existe == false) {
      myArray[i] = obras2[numeroAleatorio - 1];
    }
  }

  return {
    colecciones,
    obras,
    myArray,
    artista,
    cliente,
    admin,
    logueado,
    nombre,
  };
};

module.exports = getCollection;
