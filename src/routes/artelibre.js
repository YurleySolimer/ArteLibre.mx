const express = require('express');
const router = express.Router();
const pool = require('../database');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "El tipo de archivo no es válido" }, false);
    }
  }
});


//-------------------VISTAS DEL ADMINISTRADOR---------------------//




//-------------------ARTISTS VIEWS---------------------//

router.get('/nueva-obra', (req, res) => {
  res.render('artist/nueva-obra');
});

router.get('/registro-artista', (req, res) => {
  res.render('artist/registro');
});


  router.post('/nueva-obra',  upload.array('photos'), async (req, res) => {


    //GUARDANDO DATOS DE LA OBRA//

    const {nombre, coleccion, creacion, tecnica, estilo, ancho, alto, subasta, copias} = req.body;

    const newObra = {
      nombreObra : nombre,
      coleccion,
      lugarCreacion: creacion,
      tecnica,
      estilo,
      ancho,
      alto,
    }


  const obra = await pool.query('INSERT INTO obras set ?', [newObra]);

  //GUARDANDO FOTOS DE LA OBRA//

  console.log(req.files);

  const fotos = req.files;

  for (var i = 0; i<fotos.length; i++) {
    const path = fotos[i].path;
    const originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      obra_id: obra.insertId
    }
  
    const foto = await pool.query('INSERT INTO fotosObras set ?', [newFoto]);
    console.log(foto);
  }
 
  //const {path, originalname} = req.file;
  


    res.redirect('artista');
});


router.get('/registro-cliente', (req, res) => {
  res.render('client/registro');
});

  //-------------------VISTAS DEL CLIENTE---------------------//

router.get('/coleccion', (req, res) => {
  res.render('general/coleccion');
})

router.get('/iniciar-sesion', (req, res) => {
  res.render('auth/signin');
});

router.get('/coleccion', (req, res) => {
  res.render('general/coleccion');
});

router.get('/obra', (req, res) => {
  res.render('general/obra');
});

router.get('/artista', (req, res) => {
  res.render('general/artista');
});

router.get('/artistas', (req, res) => {
  res.render('general/artistas');
});

router.get('/obras', (req, res) => {
  res.render('general/obras');
});

router.get('/registro', (req, res) => {
  res.render('general/registro');
});



module.exports = router;