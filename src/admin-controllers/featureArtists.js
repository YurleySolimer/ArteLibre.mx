const { updateArtist } = require("../services-mysql/artists");

var featureArtists = async (data) => {
  try {
    const { id, text } = data.body;
    const destacar = {
      destacar: "Si",
      info_destacar: text,
    };
    await updateArtist(destacar, id);
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = featureArtists;
