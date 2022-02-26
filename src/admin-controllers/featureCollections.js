const { updateCollection } = require("../services-mysql/colletions");

var featureCollections = async (data) => {
  const { id } = data.body;
  const destacar = {
    destacar: "Si",
  };
  await updateCollection(destacar, id)
};

module.exports = featureCollections;
