const { updateArtist } = require("../services-mysql/artists");

var suspendArtists = async (data) => {
  const inactivo = {
    inactivo: "Si",
  };
  await updateArtist(inactivo, data.params.id)
};

module.exports = suspendArtists;
