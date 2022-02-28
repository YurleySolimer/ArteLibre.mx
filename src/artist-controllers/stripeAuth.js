const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecret);
const { saveArtistStripe } = require("../services-mysql/artists");

var stripeAuth = async (data) => {
  const { code, state } = data;

  // Send the authorization code to Stripe's API.
  stripe.oauth
    .token({
      grant_type: "authorization_code",
      code,
    })
    .then(
      async (response) => {
        var connected_account_id = response.stripe_user_id;
        await saveAccountId(connected_account_id, req, res);
        return true;
      },
      (err) => {
        console.log(err);
        return err;
      }
    );
};

async function saveAccountId(id, req, res) {
  try {
    const id_stripe = {
      id_stripe: id,
      estado: "Registrado",
      id_user: req.user.id,
    };
    await saveArtistStripe(id_stripe);
    return true;
  } catch (error) {
    return error;
  }
}
module.exports = stripeAuth;
