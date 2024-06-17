const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const bodyParser = require('body-parser');
const Subs = require('../models/Subs');
const Client = require('../models/Client');
const Employee = require('../models/Employee');
const Session = require('../models/Session');

const app = express();

// Use express.json() for other routes
app.use(express.json());


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

// Middleware to parse webhook requests
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {

      // Verify the webhook signature with the raw body
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Webhook event verified: ", event);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
   /*  switch (event.type) {
        case 'checkout.session.completed':
          try{
            const session = event.data.object;
            console.log(`Checkout session completed: ${session.id}`)

             // Check if the subscription has already been created for this session
            const existingSubscription = await Subs.findOne({ sessionId: session.id });
            if (existingSubscription) {
                console.log('Subscription already created for this session');
                return res.json({ received: true }); // Return success response without creating duplicate subscription
            }

             // Find the client associated with the Stripe customer ID
            const client = await Client.findOne({ stripeCustomerId: session.customer });
            if (!client) {
                console.error(`Client not found for customer ID: ${session.customer}`);
                return res.status(404).send('Client not found');
            }
            console.log('Client found:', client);
            
             // Find the employee by their ID specified in the metadata
            const employeeId = session.metadata.employeeId;
            const ide = await Employee.findById(employeeId);
            if (!ide) {
                console.error(`Employee not found for ID: ${employeeId}`);
                return res.status(404).send('Employee not found');
            }
            console.log('Employee found:', ide);

             // Determine subscription type and end date based on session amount
            const subscriptionType = session.amount_total === 3000 ? '1 Month' :
                                     session.amount_total === 9000 ? '3 Months' : '6 Months';
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + (subscriptionType === '1 Month' ? 1 : subscriptionType === '3 Months' ? 3 : 6));

         
            // Create sessions for the subscription
            const sessionPromises = [];
            const now = new Date();
            const numberOfSessions = subscriptionType === '1 Month' ? 4 :
                                     subscriptionType === '3 Months' ? 12 : 24;

            for (let i = 0; i < numberOfSessions; i++) {
                const baseDate = new Date(now);
                baseDate.setDate(baseDate.getDate() + (7 * i));
                const sessionDate = await findNonDuplicateSessionDate(ide, baseDate);
                const newSession = new Session({
                    "Sub": sub._id,
                    "Client": client._id,
                    "Employee": ide._id,
                    sessionDate
                });
                sessionPromises.push(newSession.save());
            }

            // Wait for all sessions to be created
            await Promise.all(sessionPromises);
          }catch(error){
            console.error(`Error processing checkout session: ${error.message}`);
            return res.status(500).json({ error: 'Internal server error' });
          }

            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    } */
// Return success response
    res.json({ received: true });
});

module.exports = router;
