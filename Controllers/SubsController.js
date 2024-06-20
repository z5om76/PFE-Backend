const asyncHandler = require('express-async-handler')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Client = require('../models/Client')
const Employee = require('../models/Employee')
const Subs = require('../models/Subs');
const Session = require('../models/Session')
const { createGoogleMeetEvent } = require('../utils/GoogleMeet');
const Notification = require('../models/Notification')
const Reminder = require('../models/Reminder')


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
      // Delete one of the duplicate subscriptions
      await existingSubscription.remove();
      return res.status(400).send({ error: 'User already has an active subscription' });
    }


   
  
    const subscriptions = await stripe.charges.list(
       
      {
        customer: client.stripeCustomerId,
      },
      {
        apiKey: process.env.STRIPE_PRIVATE_KEY,
      }
    );
    
    const plan = subscriptions.data[0].amount;

    
    let type, months;

    if (plan === 3000) {
      type = "1 Month";
      months = 1;
      
    } else if (plan === 9000) {
      type = "3 Months";
      months = 3;
      
    } else if (plan === 18000) {
      type = "6 Months";
      months = 6;
     
    }
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    const subObject = {"Type": type, "Client" : idc, "Employee" : ide.id , endDate}
    const sub = await Subs.create(subObject);

  // Check if there's more than one subscription for the client in the database
  const existingSubscriptions = await Subs.find({ "Client": idc });

  if (existingSubscriptions.length > 1) {
      // Get the first subscription to delete
      const subscriptionToDelete = existingSubscriptions[0];

      // Find all sessions associated with the subscription
    const sessionsToDelete = await Session.find({ "Sub": subscriptionToDelete._id });

       // Delete associated sessions
       await Session.deleteMany({ "Sub": subscriptionToDelete._id });

          // Find all notifications associated with the subscription
    const notificationsToDelete = await Notification.find({ "Client": idc, "Employee": ide, "Session": { $in: sessionsToDelete.map(session => session._id) } });

      // Delete associated notifications
      await Notification.deleteMany({ "Client": idc, "Employee": ide, "Session": { $in: sessionsToDelete.map(session => session._id) } });

       // Now delete the subscription
    await Subs.deleteOne({ _id: subscriptionToDelete._id });

    console.log('Duplicate subscription and associated sessions/notifications removed');
      
  }

   
  if (!sub) {
    return res.status(400).json({ message: 'Invalid sub data received' });
  }
  res.status(201).json({ message: `New sub has been created` });

        const sessionPromises = [];
        const now = new Date();
        const numberOfSessions = months * 4;

        for (let i = 0; i < numberOfSessions; i++) {
        const baseDate = new Date(now);
        baseDate.setDate(baseDate.getDate() + (7 * i)); // Each session one week apart

      const sessionDate = await findNonDuplicateSessionDate(ide, baseDate);
      const session = new Session({
        "Sub": sub.id,
        "Client": idc,
        "Employee": ide,
        sessionDate
    });

    // Create a Google Meet event for the session
    const event = await createGoogleMeetEvent(session);
    session.meetLink = event.hangoutLink; // Save the Google Meet link

      sessionPromises.push(session.save());


    const notificationObject = new Notification({
      "Client": idc,
      "Employee": ide,
      "Session": session.id,
      "notificationDate": session.sessionDate,
      "description": session.meetLink
    });

    /* const notification =  */await Notification.create(notificationObject)


    const thirtyMinutesAgo = new Date(session.sessionDate - 30 * 60 * 1000);
     
    const ReminderObject = new Reminder({
      "Client": idc,
      "Employee": ide,
      "Session": session.id,
      "reminderDate": thirtyMinutesAgo
      
    });

    /* const reminder = */ await Reminder.create(ReminderObject)


  }

    await Promise.all(sessionPromises);

      });

  module.exports = {createSubs, getSubs }