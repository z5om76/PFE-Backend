const express = require('express')
const router = express.Router()
const ReminderController = require('../Controllers/ReminderController')




router.route('/client')
    .get(ReminderController.getclientReminders)
    

module.exports = router

router.route('/employee')
    .get(ReminderController.getemployeeReminders)
    

module.exports = router