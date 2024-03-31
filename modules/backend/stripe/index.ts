import Stripe from "stripe";

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
export default new Stripe(process.env.STRIPE__API_KEY, null);
