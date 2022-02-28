const { updateObra } = require("../services-mysql/obras");

var dashboardNoGallery = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const galeria = {
        galeria: "No",
      };
      await updateObra(galeria, data.params.id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = dashboardNoGallery;
