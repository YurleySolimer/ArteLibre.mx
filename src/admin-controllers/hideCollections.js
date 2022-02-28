const pool = require("../database");
const { updateCollection } = require("../services-mysql/colletions");

var hideCollections = async (data) => {
  try {
    const ocultar = {
      ocultar: "Si",
    };
    await updateCollection(ocultar, data.params.id);
  } catch (error) {
    return error;
  }
};

module.exports = hideCollections;
