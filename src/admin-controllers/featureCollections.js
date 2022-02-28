const { updateCollection } = require("../services-mysql/colletions");

var featureCollections = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = data.body;
      const destacar = {
        destacar: "Si",
      };
      await updateCollection(destacar, id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = featureCollections;
