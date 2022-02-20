const pool = require("../database");

var getDashboard = async (data) => {
  const admin = true;
  const logueado = true;
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [data.user.id]
  );

  const date = new Date();
  var hoy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var sieteDias = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 7
  );

  const transaccionesGeneral = await pool.query(
    "select * from obraComprada where fecha_compra between ? and ?",
    [sieteDias, hoy]
  );
  var transaccionesTotal = 0;
  var ingresos = 0;

  if (transaccionesGeneral.length > 0) {
    transaccionesTotal = transaccionesGeneral.length;
    for (var i = 0; i < transaccionesGeneral.length; i++) {
      ingresos = transaccionesGeneral[i].precio + ingresos;
    }
  }

  const eventosGeneral = await pool.query(
    "select * from eventos where fecha_inicio between ? and ?",
    [sieteDias, hoy]
  );
  var eventos = 0;
  if (eventosGeneral.length > 0) {
    eventos = eventosGeneral.length;
  }

  const ultimaObra = await pool.query(
    "select * from obraCompleta order by id desc limit 1"
  );
  const galeria = await pool.query(
    "select * from artistas order by visitasGaleria desc limit 1 "
  );
  const ultimaColeccion = await pool.query(
    "select * from colecciones order by id desc limit 1"
  );
  const obraVisitada = await pool.query(
    "select * from obraCompleta order by visitas desc limit 1"
  );
  const artistasRelevantes = await pool.query(
    "select * from usuarioArtista order by visitas desc limit 3 "
  );
  const proximasSubastas = await pool.query(
    "select * from obraSubasta order by fecha_inicio desc limit 3 "
  );
  const proximosEventos = await pool.query(
    "select * from eventos order by fecha_inicio desc limit 3 "
  );

  return {
    nombre,
    admin,
    transaccionesTotal,
    ingresos,
    eventos,
    proximosEventos,
    artistasRelevantes,
    proximasSubastas,
    ultimaObra,
    obraVisitada,
    ultimaColeccion,
    galeria,
    logueado,
    dashboard,
  };
};

module.exports = getDashboard;
