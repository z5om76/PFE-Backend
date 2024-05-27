const asyncHandler = require('express-async-handler')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Client = require('../models/Client');



const getInstant = asyncHandler( async (req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  if (!prices){
  return res.status(400).json({ message: 'no prices found' })}

  return res.json(prices);
});

const createSubsecription = asyncHandler( async (req, res) => {
  const {email} = req.body
  const client = await Client.findOne({ email });
  
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }
  console.log(client)
  

 
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/sessions",
      cancel_url: "http://localhost:3000/offers",
      customer: client.stripeCustomerId,
      
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  return res.json(session);
});


module.exports = {getInstant, createSubsecription}