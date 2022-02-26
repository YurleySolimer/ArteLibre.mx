const { updateObra } = require("../services-mysql/obras");

var dashboardObrasHide = async (data) => {
  const { id } = data.params;
  const ocultar = {
    ocultar: "Si",
  };

  await updateObra(ocultar, id)
};

module.exports = dashboardObrasHide;
