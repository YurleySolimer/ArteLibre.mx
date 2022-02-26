const { updateArtist } = require("../services-mysql/artists");

var featureArtists = async (data) => {
  const { id, text } = data.body;
  const destacar = {
    destacar: "Si",
    info_destacar: text,
  };
  await updateArtist(destacar, id)
};

module.exports = featureArtists;
