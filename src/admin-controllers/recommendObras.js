const { updateObra } = require("../services-mysql/obras");

var recommendObras = async (data) => {
  const { id, text } = data.body;
  const recomendar = {
    recomendar: "Si",
    titulo_recomendada: text,
  };
  const obras = await updateObra(recomendar, id)
};

module.exports = recommendObras;
