const { updateObra } = require("../services-mysql/obras");

var recommendObras = async (data) => {
  try {
    const { id, text } = data.body;
    const recomendar = {
      recomendar: "Si",
      titulo_recomendada: text,
    };
    const obras = await updateObra(recomendar, id);
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = recommendObras;
