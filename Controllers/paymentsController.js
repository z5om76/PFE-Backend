const asyncHandler = require('express-async-handler')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Client = require('../models/Client');

console.log('Stripe Secret Key:', process.env.STRIPE_PRIVATE_KEY);

// Function to get active products
const getActiveProducts = async () => {
  try {
    const products = await stripe.products.list({ active: true });
    return products.data;
  } catch (error) {
    console.error('Error fetching active products:', error.message);
    throw error;
  }
};

// get active prices
const getPrices = asyncHandler(async (req, res) => {
  try {
    // Fetch only active products
    const activeProducts = await getActiveProducts();

    // Fetch prices for the active products
    const pricesPromises = activeProducts.map(product => 
      stripe.prices.list({
        product: product.id,
        expand: ['data.product'],
      })
    );

    const pricesArray = await Promise.all(pricesPromises);



    // Flatten the array of price lists and filter for active prices
    const activePrices = pricesArray.flatMap(priceList => priceList.data).filter(price => price.active);

    

    if (!activePrices.length) {
      return res.status(400).json({ message: 'No prices found' });
    }

    res.json({ data: activePrices });
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// create subscription
const createSubsecription = asyncHandler( async (req, res) => {
  const {email, priceId, employeeId} = req.body;


  try{
  const client = await Client.findOne({ email });
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }


  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
        {
            price: priceId, // Include the priceId directly
            quantity: 1,
        },
    ],
    success_url: 'http://localhost:3000/subscriptions/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel',
    customer: client.stripeCustomerId,
    metadata: {
      employeeId, // Pass the employee ID in metadata
      clientId: client._id.toString(), // Pass the client ID as well
    },
});




res.json({ session: session});
} catch (error) {
res.status(500).json({ message: error.message });
} 
});


module.exports = {getPrices, createSubsecription}