const Notification = require('../models/Notification')
const asyncHandler = require('express-async-handler')
const cron = require('node-cron');



const UpdateStatus  = asyncHandler(async (req, res) => {

    const notification = await Notification.find({})

    const baseDate = new Date(now);

    if(notification.notificationDate == baseDate){

        notification.active = true;
    }

    cron.schedule('0 * * * *', () => {
        console.log('Updating notifications');
        UpdateStatus();
      });


})



const deleteExpiredNotifications = async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
  
    try {
      const result = await Notification.deleteMany({ notificationsDate: { $lt: oneHourAgo } });
      console.log(`Deleted ${result.deletedCount} expired Notifcations.`);
    } catch (err) {
      console.error('Error deleting expired Notifications:', err);
    }
}

cron.schedule('0 * * * *', () => {
    console.log('Checking for expired Notifications...');
    deleteExpiredNotifications();
  });



  module.exports = {deleteExpiredNotifications, UpdateStatus}