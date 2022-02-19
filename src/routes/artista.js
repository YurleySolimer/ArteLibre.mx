const express = require("express");
const router = express.Router();
const pool = require("../database");

const { isArtista } = require("../lib/auth");
const { isLoggedIn } = require("../lib/auth");

const stripeAuth = require("../artist-controllers/stripeAuth");
const artistDashboard = require("../artist-controllers/artistDashboard");
const dashboardSales = require("../artist-controllers/dashboardSales");
const dashboardSend = require("../artist-controllers/dashboardSend");
const dashboardEvents = require("../artist-controllers/dashboardEvents");
const dashboardAuction = require("../artist-controllers/dashboardAuction");
const dashboardCollections = require("../artist-controllers/dashboardCollections");


var fs = require("fs");

var artista = false;
var logueado = false;
var dashboard = false;

const Handlebars = require("handlebars");
const dashboardStats = require("../artist-controllers/dashboardStats");
const dashboardObras = require("../artist-controllers/dashboardObras");
const dashboardNoGallery = require("../artist-controllers/dashboardNoGallery");
const dashboardYesGallery = require("../artist-controllers/dashboardYesGallery");
const dashboardObrasHide = require("../artist-controllers/dashboardObrasHide");
const dashboardObrasShow = require("../artist-controllers/dashboardObrasShow");
const dashboardObrasDelete = require("../artist-controllers/dashboardObrasDelete");
const dashboardEventsDelete = require("../artist-controllers/dashboardEventsDelete");
const dashboardNewEvent = require("../artist-controllers/dashboardNewEvent");
const dashboardNewObra = require("../artist-controllers/dashboardNewObra");
const dashboardNewCollection = require("../artist-controllers/dashboardNewCollection");

Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get("/connect/oauth", isLoggedIn, isArtista, async (req, res) => {
  const data = req.query;
  const stripeAuthResult = stripeAuth(data);
  if (stripeAuthResult === true) {
    req.flash("success", "Registro Exitoso");
    res.redirect("/dashboard/rendimiento");
  } else {
    if (stripeAuthResult.type === "StripeInvalidGrantError") {
      return res
        .status(400)
        .json({ error: "Invalid authorization code: " + code });
    } else {
      return res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});


// Dashboard
router.get("/dashboard", isLoggedIn, isArtista, async (req, res) => {
  const artistDashboardResult = artistDashboard(req)
    res.render("artist/dashboard", {
    nombre: artistDashboardResult.nombre.nombre[0],
    artista: artistDashboardResult.artista,
    logueado: artistDashboardResult.logueado,
    dashboard: artistDashboardResult.dashboard,
    obras: artistDashboardResult.obras,
    colecciones: artistDashboardResult.colecciones,
    ultima_obra: artistDashboardResult.ultima_obra,
    evento: artistDashboardResult.evento,
    subasta: artistDashboardResult.subasta,
    visitas: artistDashboardResult.visitas,
  });
});

router.get("/dashboard/ventas", isLoggedIn, isArtista, async (req, res) => { 
  const dashboardResult = dashboardSales(req) 
  res.render("artist/mis-ventas", {
    nombre: dashboardResult.nombre.nombre[0],
    artista: dashboardResult.artista,
    logueado: dashboardResult.logueado,
    dashboard: dashboardResult.dashboard,
    obras: dashboardResult.obras,
  });
});

router.post(
  "/dashboard/ventas/envio",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const codigo = dashboardSend(req)    
    req.flash("success", "Obra enviada");
    res.redirect("/dashboard/ventas");
  }
);

router.get("/dashboard/eventos", isLoggedIn, isArtista, async (req, res) => {
  
  const events = dashboardEvents(req)
  res.render("artist/mis-eventos", {
    nombre: events.nombre.nombre[0],
    artista: events.artist,
    logueado: events.logueado,
    dashboard: events.dashboard,
    eventos: events.eventos,
  });
});

router.get("/dashboard/subastas", isLoggedIn, isArtista, async (req, res) => {
  const auction = dashboardAuction(req)
  res.render("artist/mis-subastas", {
    nombre: auction.nombre.nombre[0],
    artista: auction.artista,
    logueado: auction.logueado,
    dashboard: auction.dashboard,
    obras: auction.obras,
  });
});

router.get(
  "/dashboard/colecciones",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const collections = dashboardCollections(req)
    res.render("artist/mis-colecciones", {
      nombre: collections.nombre.nombre[0],
      artista: collections.artista,
      logueado: collections.logueado,
      dashboard: collections.dashboard,
      colecciones: collections.colecciones,
    });
  }
);

router.get(
  "/dashboard/rendimiento",
  isLoggedIn,
  isArtista,
  async (req, res) => {

    const stats = dashboardStats(req)

    res.render("artist/mi-rendimiento", {
      nombre: stats.nombre.nombre[0],
      totalVisitasPerfil: stats.totalVisitasPerfil,
      totalVisitasGaleria: stats.totalVisitasGaleria,
      estaSemana: stats.estaSemana,
      estaSemanaPerfil: stats.estaSemanaPerfil,
      estaSemanaGaleria: stats.estaSemanaGaleria,
      totalVisitasEventos: stats.totalVisitasEventos,
      visitasEvento: stats.visitasEvento,
      colecciones: stats.colecciones,
      semanaPasada: stats.semanaPasada,
      semanaPasadaPerfil: stats.semanaPasadaPerfil,
      semanaPasadaGaleria: stats.semanaPasadaGaleria,
      ventasSemana: stats.ventasSemana,
      ventasMes: stats.ventasMes,
      conversionVisitas: stats.conversionVisitas,
      artista: stats.artista,
      logueado: stats.logueado,
      email: stats.email,
      url: stats.url,
      dashboard: stats.dashboard,
      stripeRegistro: stats.stripeRegistro,
    });
  }
);

router.get("/dashboard/obras", isLoggedIn, isArtista, async (req, res) => {
  const obras = dashboardObras(req)

  res.render("artist/mis-obras", {
    obras: obras.obras,
    nombre: obras.nombre.nombre[0],
    artista: obras.artista,
    logueado: obras.logu,
    dashboard: obras.dashboard,
  });
});

router.get(
  "/dashboard/obras/quitarGaleria/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {    
    const gallery = dashboardNoGallery(req)
    req.flash("success", "La no se mostrará en tu galería");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/mostrarGaleria/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const gallery = dashboardYesGallery(req)
    req.flash("success", "La obra será mostrada en tu galería");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/ocultar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
   const hide = dashboardObrasHide(req)
    req.flash("success", "La obra ha sido oculta");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/mostrar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const show = dashboardObrasShow(req)
    req.flash("success", "La obra será mostrada");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/obras/eliminar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const deleted = dashboardObrasDelete(req)
    req.flash("success", "La obra ha sido eliminada");
    res.redirect("/dashboard/obras");
  }
);

router.get(
  "/dashboard/eventos/eliminar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const deleted = dashboardEventsDelete(req)
    req.flash("success", "El evento ha sido eliminado");
    res.redirect("/dashboard/eventos");
  }
);

//
// Dashboard nuevos elementos GET
//

router.get(
  "/dashboard/nuevo-evento",
  isLoggedIn,
  isArtista,
  async (req, res) => {    
    const newEvent = dashboardNewEvent(req)
    res.render("artist/dashboard-nuevo-evento", {
      nombre: newEvent.nombre.nombre[0],
      artista: newEvent.artista,
      logueado: newEvent.logueado,
      dashboard: newEvent.dashboard,
    });
  }
);

router.get("/dashboard/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  const newObra = dashboardNewObra(req)
  res.render("artist/dashboard-nueva-obra", {
    nombre: newObra.nombrenombre[0],
    colecciones: newObra.colecciones,
    artista: newObra.artista,
    logueado: newObra.logueado,
    dashboard: newObra.dashboard,
  });
});

router.get(
  "/dashboard/nueva-coleccion",
  isLoggedIn,
  isArtista,
  async (req, res) => {
   const newCollection = dashboardNewCollection(req)
    res.render("artist/dashboard-nueva-coleccion", {
      nombre: newCollection.nombre.nombre[0],
      artista: newCollection.artista,
      logueado: newCollection.logueado,
      dashboard: newCollection.dashboard,
    });
  }
);

//
// Nuevos elementos por fuera del dashboard GET
//

router.get("/nuevo-evento", isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [req.user.id]
  );
  artista = true;
  logueado = true;
  dashboard = false;
  res.render("artist/nuevo-evento", {
    nombre: nombre[0],
    artista,
    logueado,
    dashboard,
  });
});

router.get("/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [req.user.id]
  );
  artista = true;
  logueado = true;
  dashboard = false;
  const artistainfo =
    ("SELECT id FROM artistas WHERE user_id =?", [req.user.id]);
  console.log(artistainfo);
  const colecciones = await pool.query(
    "SELECT nombreColeccion, id from colecciones WHERE artista_id =?",
    [artistainfo[0]]
  );
  res.render("artist/nueva-obra", {
    nombre: nombre[0],
    colecciones,
    artista,
    logueado,
    dashboard,
  });
});

router.get("/nueva-coleccion", isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [req.user.id]
  );
  artista = true;
  logueado = true;
  dashboard = false;
  res.render("artist/nueva-coleccion", {
    nombre: nombre[0],
    artista,
    logueado,
    dashboard,
  });
});

//
// Nuevos elementos POST
//

router.post("/nueva-obra", isLoggedIn, isArtista, async (req, res) => {
  //GUARDANDO DATOS DE LA OBRA//
  const {
    nombreObra,
    coleccion,
    creacion,
    tecnica,
    estilo,
    precioFinal,
    ancho,
    alto,
    subasta,
    copias,
    descripcion,
    lcreacion,
    fcreacion,
  } = req.body;
  var nombreColeccion = "N/A";
  var subastar = "No";

  if (subasta == "on") {
    subastar = "Si";
  }

  if (coleccion > 0) {
    nombreColeccion = await pool.query(
      "SELECT nombreColeccion FROM colecciones WHERE id =?",
      [coleccion]
    );
    nombreColeccion = nombreColeccion[0];
  }

  const newObra = {
    nombreObra: nombreObra,
    coleccion: nombreColeccion.nombreColeccion,
    coleccion_id: coleccion,
    lugarCreacion: lcreacion,
    fecha_creacion: fcreacion,
    tecnica,
    estilo,
    ancho,
    alto,
    subastar,
    precio: precioFinal,
    descripcion,
    artista_id: req.user.id,
  };

  const obra = await pool.query("INSERT INTO obras set ?", [newObra]);

  if (subastar == "Si") {
    const newSubasta = {
      obra_id: obra.insertId,
    };

    await pool.query("INSERT INTO subastasInfo set ?", [newSubasta]);
  }

  const artista_obras = await pool.query(
    "SELECT * FROM obras WHERE artista_id =?",
    [req.user.id]
  );
  const numero_obras = {
    numero_obras: artista_obras.length,
  };

  await pool.query("UPDATE artistas SET? WHERE user_id =?", [
    numero_obras,
    req.user.id,
  ]);

  //GUARDANDO FOTOS DE LA OBRA//

  const fotos = req.files;
  var principal = "false";
  for (var i = 0; i < fotos.length; i++) {
    if (i == fotos.length - 1) {
      principal = true;
    }
    const path = fotos[i].path;
    var originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      principal,
      obra_id: obra.insertId,
    };

    const foto = await pool.query("INSERT INTO fotosObras set ?", [newFoto]);
  }
  artista = true;
  logueado = true;

  const todoColeccicones = await pool.query(
    "SELECT * from colecciones WHERE id =?",
    [coleccion]
  );
  if (todoColeccicones.length > 0) {
    var precioPromedio =
      todoColeccicones[0].precioPromedio * 1 + precioFinal * 1;
    const colecicon_obras = await pool.query(
      "SELECT * FROM obras WHERE coleccion_id =?",
      [coleccion]
    );
    var piezas = 0;
    if (colecicon_obras) {
      piezas = colecicon_obras.length;
    } else {
      piezas + 1;
    }

    console.log(precioPromedio);
    const NewColeccion = {
      fotoNombre: originalname,
      precioPromedio,
      piezas,
    };
    await pool.query("UPDATE colecciones set? WHERE id=?", [
      NewColeccion,
      coleccion,
    ]);
  }

  if (dashboard) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/dashboard/obras");
  }
});

router.post("/nueva-coleccion", isLoggedIn, isArtista, async (req, res) => {
  const {
    nombre,
    año,
    descripcion,
    estilo,
    tecnica,
    ubicacionPais,
    ubicacionCiudad,
  } = req.body;
  const newColeccion = {
    nombreColeccion: nombre,
    anio: año,
    descripcion,
    estilo,
    tecnica,
    pais: ubicacionPais,
    ciudad: ubicacionCiudad,
    artista_id: req.user.id,
  };
  await pool.query("INSERT into colecciones SET ?", [newColeccion]);

  const artista_colecciones = await pool.query(
    "SELECT * FROM colecciones WHERE artista_id =?",
    [req.user.id]
  );
  const numero_colecciones = {
    numero_colecciones: artista_colecciones.length,
  };

  await pool.query("UPDATE artistas SET? WHERE user_id =?", [
    numero_colecciones,
    req.user.id,
  ]);

  if (dashboard) {
    res.redirect("/dashboard/nueva-obra");
  } else {
    res.redirect("nueva-obra");
  }
});

router.post("/nuevo-evento", isLoggedIn, isArtista, async (req, res) => {
  const {
    nombre,
    titulo,
    organizadores,
    hora,
    inicio,
    fin,
    local,
    direccion,
    piezas,
    ciudad,
    pais,
    estilo,
    descripcion,
  } = req.body;
  const newEvento = {
    nombre,
    titulo,
    organizadores,
    hora_inicio: hora,
    fecha_inicio: inicio,
    fecha_fin: fin,
    dir_local: local,
    direccion,
    ciudad,
    pais,
    piezas,
    estilo,
    descripcion,
    artista_id: req.user.id,
  };

  const evento = await pool.query("INSERT INTO eventos SET?", [newEvento]);
  const artista_eventos = await pool.query(
    "SELECT * FROM eventos WHERE artista_id =?",
    [req.user.id]
  );
  const numero_eventos = {
    numero_eventos: artista_eventos.length,
  };

  await pool.query("UPDATE artistas SET? WHERE user_id =?", [
    numero_eventos,
    req.user.id,
  ]);

  for (var i = 0; i < req.files.length; i++) {
    var principal = "false";
    if (i == 0) {
      principal = "true";
    } else {
      principal = "false";
    }
    const { originalname, path } = req.files[i];
    const newFotoEvento = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      evento_id: evento.insertId,
      principal,
    };
    await pool.query("INSERT INTO fotosEventos SET?", [newFotoEvento]);
  }
  if (dashboard) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/dashboard/eventos");
  }
});

router.post(
  "/dashboard/eventos/editar/:id",
  isLoggedIn,
  isArtista,
  async (req, res) => {
    const { id } = req.params;

    const {
      nombre,
      titulo,
      organizadores,
      hora,
      inicio,
      fin,
      local,
      direccion,
      piezas,
      ciudad,
      pais,
      estilo,
    } = req.body;
    const newEvento = {
      nombre,
      titulo,
      organizadores,
      hora_inicio: hora,
      fecha_inicio: inicio,
      fecha_fin: fin,
      dir_local: local,
      direccion,
      ciudad,
      pais,
      piezas,
      estilo,
    };

    const evento = await pool.query("UPDATE eventos SET ? WHERE id =?", [
      newEvento,
      id,
    ]);
    req.flash("success", "Evento actualizado");
    res.redirect("/dashboard/eventos");
  }
);

router.post("/obra/editar/:id", isLoggedIn, isArtista, async (req, res) => {
  const { id } = req.body;

  //ACTUALIZANDO DATOS DE LA OBRA//
  const {
    nombre,
    coleccion,
    creacion,
    tecnica,
    estilo,
    precio,
    ancho,
    alto,
    subasta,
    copias,
    descripcion,
    lcreacion,
    fcreacion,
  } = req.body;
  var nombreColeccion = "N/A";

  if (coleccion > 0) {
    nombreColeccion = await pool.query(
      "SELECT nombreColeccion FROM colecciones WHERE id =?",
      [coleccion]
    );
    nombreColeccion = nombreColeccion[0];
  }
  const newObra = {
    nombreObra: nombre,
    coleccion: nombre,
    coleccion_id: coleccion,
    lugarCreacion: lcreacion,
    fecha_creacion: fcreacion,
    tecnica,
    estilo,
    ancho,
    alto,
    precio,
    descripcion,
    artista_id: req.user.id,
  };

  const obra = await pool.query("UPDATE obras set ? WHERE id =?", [
    newObra,
    id,
  ]);

  //GUARDANDO FOTOS DE LA OBRA//

  const fotos = req.files;
  var principal = "false";
  for (var i = 0; i < fotos.length; i++) {
    if (i == fotos.length - 1) {
      principal = true;
    }
    const path = fotos[i].path;
    var originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      principal,
      obra_id: id,
    };

    const foto = await pool.query("INSERT INTO fotosObras set ?", [newFoto]);
  }
  const fotoColeccion = {
    fotoNombre: originalname,
  };
  await pool.query("UPDATE colecciones set? WHERE id=?", [
    fotoColeccion,
    coleccion,
  ]);

  res.redirect("/obra/" + id);
});

//
// Perfil
//

router.get("/artist-perfil", isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query(
    "SELECT nombre, apellido FROM users WHERE id =?",
    [req.user.id]
  );
  const user = await pool.query("SELECT * FROM usuarioArtista WHERE id =?", [
    req.user.id,
  ]);
  const obras = await pool.query(
    "SELECT * FROM obraCompleta WHERE artista_id =?",
    [req.user.id]
  );
  var ultima_obra = {
    nombreObra: "N/A",
    id: "#",
  };
  if (obras.length > 0) {
    ultima_obra = obras[obras.length - 1];
  }
  artista = true;
  logueado = true;
  dashboard = false;
  res.render("artist/perfil", {
    nombre: nombre[0],
    user: user[0],
    obras,
    ultima_obra,
    artista,
    logueado,
    dashboard,
  });
});

router.post("/editar-Artista", isLoggedIn, isArtista, async (req, res) => {
  const { fullname, email, apellido, telefono } = req.body;
  var path = "";
  var originalname = "";

  if (req.body.image) {
    var img = req.body.image;
    // luego extraes la cabecera del data url
    var base64Data = img.replace(/^data:image\/png;base64,/, "");
    var path = `src/public/uploads/${fullname}${email}.png`;
    var originalname = `${fullname}${email}.png`;

    // grabas la imagen el disco
    fs.writeFile(
      `src/public/uploads/${fullname}${email}.png`,
      base64Data,
      "base64",
      function (err) {
        console.log(err);
      }
    );
  }

  let newUser = {
    nombre: fullname,
    email,
    apellido,
    telefono,
    foto_ubicacion: path,
    foto_nombre: originalname,
  };

  const result = await pool.query("UPDATE users SET ? WHERE id=? ", [
    newUser,
    req.body.idArtist,
  ]);

  console.log(req.body);

  console.log(result);

  const {
    pais,
    region,
    provincia,
    años,
    direccion,
    disciplina_principal,
    estilo,
    frase,
    biografia,
  } = req.body;

  let newArtista = {
    pais,
    region,
    provincia,
    años_experiencia: años,
    direccion,
    disciplina_principal,
    biografia,
    frase,
  };

  const artist = await pool.query("UPDATE artistas SET ? WHERE user_id=? ", [
    newArtista,
    req.body.idArtist,
  ]);
  console.log(artist);

  res.redirect("/artist-perfil");
});

module.exports = router;
