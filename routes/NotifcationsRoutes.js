const express = require('express')
const router = express.Router()
const NotificationsController = require('../Controllers/NotificationsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


router.route('/client')
    .get(verifyJWT, NotificationsController.getclientNotifications);
    

module.exports = router

router.route('/employee')
    .get(verifyJWT, NotificationsController.getemployeeNotifications)
    

module.exports = router