const Reminder = require('../models/Reminder')
const asyncHandler = require('express-async-handler')




const getclientReminders = asyncHandler ( async (req, res) => {
    const {client} = req.body
  
    const reminder = await Reminder.find({"Client":client})
    

  
    if (!reminder?.length) {
        return res.status(400).json({ message: 'No Reminders found' })
    }

    const activeReminders = reminder.filter(reminder => reminder.active);

        // Check if there are any inactive reminders
        if (activeReminders.length === 0) {
            return res.status(400).json({ message: 'No active reminders found' });}

    
            return res.json(activeReminders);
  })


  const getemployeeReminders = asyncHandler ( async (req, res) => {
    const {employee} = req.body
  
    const reminder = await Reminder.find({"Employee":employee})
    

  
    if (!reminder?.length) {
        return res.status(400).json({ message: 'No Reminders found' })
    }

    const activeReminders = reminder.filter(reminder => reminder.active);

        // Check if there are any inactive reminders
        if (activeReminders.length === 0) {
            return res.status(400).json({ message: 'No active reminders found' });}

    
            return res.json(activeReminders);
  })

  module.exports = {
    getclientReminders,
    getemployeeReminders
  }