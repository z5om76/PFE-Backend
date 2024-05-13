
// change file name to "coachRoutes.js" and "getCouchs" to "getCoaches"
const express = require('express')
const router = express.Router()
const employesController = require('../Controllers/employesController')

router.route('/')
    
    .get(employesController.getCouchs)
    
    

module.exports = router