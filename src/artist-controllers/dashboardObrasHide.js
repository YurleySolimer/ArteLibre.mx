const { updateObra } = require("../services-mysql/obras");

var dashboardObrasHide = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = data.params;
      const ocultar = {
        ocultar: "Si",
      };

      await updateObra(ocultar, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = dashboardObrasHide;
