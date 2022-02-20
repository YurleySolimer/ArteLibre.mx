const { getToken } = require("../services-mysql/tokens");
const code = async (data) => {
  const token = data.token;
  const allToken = await getToken(token)
  if (allToken.length > 0) {
    var current = new Date();
    var expiration = allToken[0].expiration;
    var creation = allToken[0].createdAt;

    if (
      current.getTime() < expiration.getTime() &&
      expiration.getTime() > creation.getTime()
    ) {
      return {code: 'true'}
    } else {
        return {code: 'expirado'}
    }
  } else {
    return {code: 'false'}
  }
};

module.exports = code