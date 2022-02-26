const { getUserName } = require("../services-mysql/users");

var getNewCollection = async (data) => {
  const nombre = await getUserName(data.user.id)
 const artista = true;
 const logueado = true;

 return {
     nombre,
     artista,
     logueado
 }
};

module.exports = getNewCollection;
