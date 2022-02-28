const {
  saveClientShop,
  getClientData,
  updateClient,
} = require("../services-mysql/clients");
const { updateObra, getObraPrice } = require("../services-mysql/obras");
const isClient = require("./isClient");

var getObraSuccess = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      cliente = await isClient(data);
      if (cliente == true) {
        const id = data.params.id;
        const newCompra = {
          estado: "Pago",
          id_obra: id,
          id_user: data.user.id,
        };

        await saveClientShop(newCompra);
        const comprada = {
          comprada: "Si",
        };
        await updateObra(comprada, id);

        const precioObra = await getObraPrice(id);

        var obrasCompradas = await getClientData(data.user.id);
        var obrasTotal = obrasCompradas[0].obrasCompradas + 1;
        const totalCompras =
          obrasCompradas[0].totalCompras + precioObra[0].precio;
        const date = new Date();
        const hoy = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );

        var obrasTotalCompradas = {
          obrasCompradas: obrasTotal,
          ultima_compra: hoy,
          totalCompras,
        };
        await updateClient(obrasTotalCompradas, data.user.id);
      }

      return resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getObraSuccess;
