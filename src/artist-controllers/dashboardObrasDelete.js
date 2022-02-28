const { deleteAuctionInfo } = require("../services-mysql/auctions");
const { deleteClientShop } = require("../services-mysql/clients");
const { deleteObraPics, deleteObra } = require("../services-mysql/obras");

var dashboardObrasDelete = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = data.params;

      await deleteClientShop(id);
      await deleteAuctionInfo(id);
      await deleteObraPics(id);
      await deleteObra(id);
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = dashboardObrasDelete;
