const { updateObra } = require("../services-mysql/obras");

var dashboardObrasShow = async (data) => {
  const { id } = data.params;
  const ocultar = {
    ocultar: "No",
  };

  await updateObra(ocultar, id)
};

module.exports = dashboardObrasShow;
