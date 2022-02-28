var stripeSession = async (data, userID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = data.params.id;

      var fee = Math.round(obra[0].precio * 0.15);
      var pago = obra[0].precio * 100;
      var domainURL = process.env.DOMAIN;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            name: "Arte Libre",
            amount: pago,
            currency: "mxn",
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: fee,
          transfer_data: {
            destination: userID,
          },
        },
        success_url: `${domainURL}/obra/success/${id}`,
        cancel_url: `${domainURL}/obra/${id}`,
      });
      const session_id = session.id;

      return resolve({
        session_id,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = stripeSession;
