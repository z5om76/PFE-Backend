const Reminder = require('../models/Reminder')
const asyncHandler = require('express-async-handler')
const cron = require('node-cron');



const UpdateStatus  = asyncHandler(async (req, res) => {

    const reminder = await Reminder.find({})

    const baseDate = new Date(now);

    if(reminder.reminderDate == baseDate){

        reminder.active = true;
    }

    cron.schedule('0 * * * *', () => {
        console.log('Updating reminders');
        UpdateStatus();
      });


})



const deleteExpiredReminders = async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (30 * 60 * 1000));
  
    try {
      const result = await Reminder.deleteMany({ remindersDate: { $lt: oneHourAgo } });
      console.log(`Deleted ${result.deletedCount} expired Reminders.`);
    } catch (err) {
      console.error('Error deleting expired Reminders:', err);
    }
}

cron.schedule('0 * * * *', () => {
    console.log('Checking for expired Reminders...');
    deleteExpiredReminders();
  });



  module.exports = {deleteExpiredReminders, UpdateStatus}