const { updateObra } = require("../services-mysql/obras");

var dashboardObrasShow = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = data.params;
      const ocultar = {
        ocultar: "No",
      };

      await updateObra(ocultar, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = dashboardObrasShow;
