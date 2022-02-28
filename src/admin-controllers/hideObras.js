const pool = require("../database");
const { updateObra } = require("../services-mysql/obras");

var hideObras = async (data) => {
  try {
    const ocultar = {
      ocultar: "Si",
    };
    await updateObra(ocultar, data.params.id);
  } catch (error) {
    return error;
  }
};

module.exports = hideObras;
