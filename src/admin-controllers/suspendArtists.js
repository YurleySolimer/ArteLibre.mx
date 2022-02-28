const { updateArtist } = require("../services-mysql/artists");

var suspendArtists = async (data) => {
  try {
    const inactivo = {
      inactivo: "Si",
    };
    await updateArtist(inactivo, data.params.id);
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = suspendArtists;
