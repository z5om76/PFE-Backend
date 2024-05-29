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









const getSubs = asyncHandler ( async (req, res) => {
  const {client} = req.body

  const subs = await Subs.find({"Client":client})

 
  if (!subs?.length) {
      return res.status(400).json({ message: 'No subs found' })
  }

  res.json(subs)
})
  




  const createSubs = asyncHandler ( async (req, res) => {
    const {employee, email} = req.body

    const client = await Client.findOne({ email });
    const idc = client.id
    const ide = await Employee.findById (employee)
    
  
  const existingSubscription = await Subs.findOne({ "Client": idc, active: true });
  if (existingSubscription) {
    return res.status(400).send({ error: 'User already has an active subscription' });
  }


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
    
    const plan = subscriptions.data[0].amount;
    
    if (plan === 3000) {

        const type = "1 Month"
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        const subObject = {"Type": type, "Client" : idc, "Employee" : ide.id , endDate}
        const sub = await Subs.create(subObject);

        if (sub) { //created 
            res.status(201).json({ message: `New sub has been created` })
        } else {
            res.status(400).json({ message: 'Invalid sub data received' })
        }

        const sessionPromises = [];
        const now = new Date();
       for (let i = 0; i < 4; i++) {
        const baseDate = new Date(now);
        baseDate.setDate(baseDate.getDate() + (7 * i)); // Each session one week apart

      const sessionDate = await findNonDuplicateSessionDate(ide, baseDate);
      const session = new Session({
        "Sub": sub.id,
        "Client": idc,
        "Employee": ide,
        sessionDate
    });
      sessionPromises.push(session.save());
  }

    await Promise.all(sessionPromises);

      }
        else if (plan === 9000) {
          const type = "3 Months"
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 3);
          const subObject = {"Type": type, "Client" : idc, "Employee" : ide.id , endDate}
          const sub = await Subs.create(subObject);
  
          if (sub) { //created 
              res.status(201).json({ message: `New sub has been created` })
          } else {
              res.status(400).json({ message: 'Invalid sub data received' })


              const sessionPromises = [];
        const now = new Date();
       for (let i = 0; i < 12; i++) {
        const baseDate = new Date(now);
        baseDate.setDate(baseDate.getDate() + (7 * i)); // Each session one week apart

      const sessionDate = await findNonDuplicateSessionDate(ide, baseDate);
      const session = new Session({
        "Sub": sub.id,
        "Client": idc,
        "Employee": ide,
        sessionDate
    });
      sessionPromises.push(session.save());
  }

    await Promise.all(sessionPromises);
          }} 
        else if (plan === 18000) {
          const type = "6 Months"
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 6);
          const subObject = {"Type": type, "Client" : idc, "Employee" : ide.id , endDate}
          const sub = await Subs.create(subObject);
  
          if (sub) { //created 
              res.status(201).json({ message: `New sub has been created` })
          } else {
              res.status(400).json({ message: 'Invalid sub data received' })
          }

          const sessionPromises = [];
        const now = new Date();
       for (let i = 0; i < 24; i++) {
        const baseDate = new Date(now);
        baseDate.setDate(baseDate.getDate() + (7 * i)); // Each session one week apart

      const sessionDate = await findNonDuplicateSessionDate(ide, baseDate);
      const session = new Session({
        "Sub": sub.id,
        "Client": idc,
        "Employee": ide,
        sessionDate
    });
      sessionPromises.push(session.save());
  }

    await Promise.all(sessionPromises);
      }
      

      
});




  module.exports = {createSubs, getSubs }