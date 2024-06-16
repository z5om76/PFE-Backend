const asyncHandler = require('express-async-handler')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Client = require('../models/Client')
const Employee = require('../models/Employee')
const Subs = require('../models/Subs');
const Session = require('../models/Session')


function getRandomDaytimeHour() {
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  return hour;
}


async function findNonDuplicateSessionDate(ide, baseDate) {
  let sessionDate;
  let isDuplicate;
  do {
    const randomHour = getRandomDaytimeHour();
    sessionDate = new Date(baseDate);
    sessionDate.setHours(randomHour, 0, 0, 0);
    
    // Check if a session already exists for this date and time for the user
    isDuplicate = await Session.findOne({ "Employee": ide, sessionDate });
  } while (isDuplicate);
  return sessionDate;
}


// get subscriptions
const getSubs = asyncHandler ( async (req, res) => {
  const {client} = req.body

  const subs = await Subs.find({"Client":client})

  if (!subs?.length) {
      return res.status(400).json({ message: 'No subs found' })
  }

  res.json(subs)
})
  

// create subscriptions
  const createSubs = asyncHandler ( async (req, res) => {
    const {employee, priceId, email} = req.body


    try{
    // Find the client by email
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const idc = client._id


     // Find the employee by ID
     const ide = await Employee.findById(employee);
     if (!ide) {
         return res.status(404).json({ message: 'Employee not found' });
     }
    
   // Check if the user already has an active subscription
  const existingSubscription = await Subs.findOne({ "Client": idc, active: true });
  if (existingSubscription) {
    return res.status(400).json({ error: 'User already has an active subscription' });
  }

   // Determine subscription type and duration based on priceId 
   let subscriptionType;
   switch (priceId) {
       case 'price_1PAbGdBDSmUawiP5ZEgYEmc1':
           subscriptionType = 1;
           break;
       case 'price_1PLMLYBDSmUawiP5iTkBuYV5':
           subscriptionType = 3;
           break;
       case 'price_1PLMMQBDSmUawiP5PwBfGNml':
           subscriptionType = 6;
           break;
       default:
           subscriptionType = 1; // Default to 1 month
   }

  
   // Create a subscription session with Stripe
   const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
        price: priceId,
        quantity: 1,
    }],
    customer: client.stripeCustomerId, // Specify the Stripe customer ID
    success_url: 'http://localhost:3000/subscriptions/success?session_id={CHECKOUT_SESSION_ID}', // Redirect URL on successful payment
    cancel_url: 'http://localhost:3000/cancel', // Redirect URL if user cancels
    metadata: {
        employeeId: employee, // Pass the employee ID in metadata
        clientId: idc.toString(), // Pass the client ID as well
        subscriptionType: `${subscriptionType} ${subscriptionType > 1 ? 'months' : 'month'}` // Pass subscription type in metadata
    }
});

    // Save the Stripe session ID to the client to track the ongoing process
    client.stripeSessionId = session.id;
    await client.save();

        // Create subscription in the database
        const subscription = await createSubscription(idc, employee, subscriptionType);


// Return the session details to the frontend
res.json({ session });
}catch(error){
     console.error('Error creating subscription session:', error);
        res.status(500).json({ message: 'Internal server error' });
}
});

async function createSubscription(clientId, employeeId, subscriptionType) {
  try {
      // Find the client by ID
      const client = await Client.findById(clientId);
      if (!client) {
          throw new Error('Client not found');
      }

      // Find the employee by ID
      const employee = await Employee.findById(employeeId);
      if (!employee) {
          throw new Error('Employee not found');
      }

       // Determine subscription type label based on subscription duration
       const subscriptionTypeLabel = subscriptionType === 1 ? 'Month' : 'Months';

      // Determine subscription end date based on subscription type
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + subscriptionType);

      // Create subscription object
      const subscription = new Subs({
          Type: subscriptionType + ' '+ subscriptionTypeLabel,
          Client: client._id,
          Employee: employee._id,
          startDate: new Date(),
          endDate: endDate,
          active: true
      });

      // Save the subscription to the database
      await subscription.save();

      return subscription;
  } catch (error) {
      throw new Error('Error creating subscription: ' + error.message);
  }
}



  module.exports = {createSubs, getSubs }