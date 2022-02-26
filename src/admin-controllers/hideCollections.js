const pool = require("../database");
const { updateCollection } = require("../services-mysql/colletions");

var hideCollections = async (data) => {
  const ocultar = {
    ocultar: "Si",
  };
  await updateCollection(ocultar, data.params.id)
};

module.exports = hideCollections;
