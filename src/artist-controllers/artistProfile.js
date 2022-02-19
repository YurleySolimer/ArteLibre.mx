const pool = require("../database");

var artistProfile = async (data) => {
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

      return {
          nombre,
          user,
          obras,
          ultima_obra,
          artista,
          logueado
      }
};

module.exports = artistProfile;
