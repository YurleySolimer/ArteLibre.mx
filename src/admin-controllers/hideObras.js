const pool = require("../database");
const { updateObra } = require("../services-mysql/obras");

var hideObras = async (data) => {
    const ocultar = {
      ocultar: "Si",
    };
    await updateObra(ocultar, data.params.id)
};

module.exports = hideObras;
