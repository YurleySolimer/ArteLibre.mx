const { updateObra } = require("../services-mysql/obras");

var featureObras = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = data.body;
      const destacar = {
        destacar: "Si",
      };
      await updateObra(destacar, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = featureObras;
