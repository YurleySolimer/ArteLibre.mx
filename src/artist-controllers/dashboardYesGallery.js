const pool = require("../database");
const { updateObra } = require("../services-mysql/obras");

var dashboardYesGallery = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = data.params.id;
      const galeria = {
        galeria: "Si",
      };
      await updateObra(galeria, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = dashboardYesGallery;
