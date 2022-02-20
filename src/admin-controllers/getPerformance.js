const pool = require("../database");
const isArtist = require("../arteLibre-controllers/isArtist");
const isAdmin = require("../arteLibre-controllers/isAdmin");
const isClient = require("../arteLibre-controllers/isClient");

var getPerformance = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  const clientesRegion = await pool.query(
    "SELECT region, count(*) as numero from clientes  group by region order by numero desc limit 5"
  );
  const clientesDestacados = await pool.query(
    "SELECT * from usuarioCliente order by obrasCompradas desc limit 5"
  );
  const clientesTotal = await pool.query("SELECT * from clientes");
  const compradoresTotal = await pool.query(
    "SELECT id_user, count(*) as comprador from clienteCompra group by id_user"
  );
  var compradoresTasa = 0;
  if (clientesTotal.length > 0 && compradoresTotal.length > 0) {
    compradoresTasa = (compradoresTotal.length / clientesTotal.length) * 100;
  }
  const obrasTotal = await pool.query("Select precio from obraComprada");
  var precioSuma = 0;
  if (obrasTotal.length > 0) {
    for (var i = 0; i < obrasTotal.length; i++) {
      precioSuma = obrasTotal[i].precio + precioSuma;
    }
    var precioPromedio = precioSuma / obrasTotal.length;
  }

  const artistasDestacados = await pool.query(
    "SELECT *, avg(precio) as precioProm, count(id) as totalObras from obraComprada group by artista_id order by precioProm desc limit 5"
  );
  const obrasSuma = await pool.query("SELECT *  FROM obras");
  const artistasSuma = await pool.query("SELECT *  FROM artistas");
  var promArtistasObra = 0;
  if (obrasSuma.length > 0 && artistasSuma.length > 0) {
    promArtistasObra = obrasSuma.length / artistasSuma.length;
  }

  const totalGanancia = await pool.query("SELECT * from obraComprada");
  var promGanancia = 0;
  var sumGanancia = 0;
  if (totalGanancia.length > 0) {
    for (var j = 0; j < totalGanancia.length; j++) {
      sumGanancia = totalGanancia[j].precio + sumGanancia;
    }
    promGanancia = (sumGanancia / totalGanancia.length) * 0.85;
  }

  return {
    nombre,
    admin,
    precioPromedio,
    promArtistasObra,
    promGanancia,
    logueado,
    dashboard,
    clientesRegion,
    artistasDestacados,
    compradoresTasa,
    clientesDestacados,
  };
};

module.exports = getPerformance;
