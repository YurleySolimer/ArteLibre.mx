const pool = require("../database");
const { updateObra } = require("../services-mysql/obras");

var dashboardYesGallery = async (data) => {
  const id = data.params.id
  const galeria = {
    galeria: "Si",
  };
  await updateObra(galeria, id);
  return true;
};

module.exports = dashboardYesGallery;
