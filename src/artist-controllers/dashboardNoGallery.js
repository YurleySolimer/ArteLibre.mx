const { updateObra } = require("../services-mysql/obras");

var dashboardNoGallery = async (data) => {
  const galeria = {
    galeria: "No",
  };
  await updateObra(galeria, data.params.id)
  return true;
};

module.exports = dashboardNoGallery;
