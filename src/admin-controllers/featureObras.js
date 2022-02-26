const { updateObra } = require("../services-mysql/obras");

var featureObras = async (data) => {
  const { id } = data.body;
  const destacar = {
    destacar: "Si",
  };
  await updateObra(destacar, id)
};

module.exports = featureObras;
