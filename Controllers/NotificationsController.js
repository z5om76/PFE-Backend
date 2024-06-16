const Notification = require('../models/Notification')
const asyncHandler = require('express-async-handler')




const getclientNotifications = asyncHandler ( async (req, res) => {
    const {client} = req.body
  
    const notification = await Notification.find({"Client":client})
    

  
    if (!notification?.length) {
        return res.status(400).json({ message: 'No notifcations found' })
    }

    const activeNotifications = notification.filter(notification => notification.active);

        // Check if there are any inactive notifications
        if (activeNotifications.length === 0) {
            return res.status(400).json({ message: 'No active notifications found' });}

    
            return res.json(activeNotifications);
  })


  const getemployeeNotifications = asyncHandler ( async (req, res) => {
    const {employee} = req.body
  
    const notification = await Notification.find({"Employee":employee})
    

  
    if (!notification?.length) {
        return res.status(400).json({ message: 'No notifcations found' })
    }

    const activeNotifications = notification.filter(notification => notification.active);

        // Check if there are any inactive notifications
        if (activeNotifications.length === 0) {
            return res.status(400).json({ message: 'No active notifications found' });}

    
            return res.json(activeNotifications);
  })



  module.exports = {
    getclientNotifications,
    getemployeeNotifications
  }