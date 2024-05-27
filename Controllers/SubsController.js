const asyncHandler = require('express-async-handler')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Client = require('../models/Client')
const Employee = require('../models/Employee')
const Subs = require('../models/Subs');
const verifyJWT = require('../middleware/verifyJWT');





const getSubs = asyncHandler ( async (req, res) => {
  const {email} = req.body
    const client = await Client.findOne({ email });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
  
    const subscriptions = await stripe.charges.list(
       
      {
        customer: client.stripeCustomerId,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );
    console.log(client.stripeCustomerId);
    console.log('Subscriptions:', subscriptions);
    const plan = subscriptions.data[0].amount;
    res.json(plan);
  });




  const createSubs = asyncHandler ( async (req, res) => {
    const {Employee, email} = req.body

    const client = await Client.findOne({ email });
    const idc = client.id
    const ide = await Subs.findById ({Employee})

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
  
    const subscriptions = await stripe.charges.list(
       
      {
        customer: client.stripeCustomerId,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );
    console.log(client.stripeCustomerId);
    console.log('Subscriptions:', subscriptions);
    const plan = subscriptions.data[0].amount;
    
    if (plan === 3000) {
        const type = "1 Month"
        const subObject = {"Type": type, "Client" : idc, "Employee" : ide }
        const sub = await Subs.create(subObject);

        if (sub) { //created 
            res.status(201).json({ message: `New sub ${Subs.id} created` })
        } else {
            res.status(400).json({ message: 'Invalid sub data received' })
        }
      }
 /*       else if (plan === 90) {
            const type = "3 Months"
            const subObject = { employee, client, type}
            const sub = await Subs.create(subObject);
        
            if (sub) { //created 
                res.status(201).json({ message: `New sub ${Subs.id} created` })
            } else {
                res.status(400).json({ message: 'Invalid sub data received' })
            }} 
        else {
            const type = "6 Months"
            const subObject = { employee, client, type}
            const sub = await Subs.create(subObject);

            if (sub) { //created 
                res.status(201).json({ message: `New sub ${Subs.id} created` })
            } else {
                res.status(400).json({ message: 'Invalid sub data received' })
            }
      }
      */

      
});
  
  module.exports = {createSubs, getSubs }