const express = require('express')
const router = express.Router()
const NotificationsController = require('../Controllers/NotificationsController')




router.route('/client')
    .get(NotificationsController.getclientNotifications)
    

module.exports = router

router.route('/employee')
    .get(NotificationsController.getclientNotifications)
    

module.exports = router