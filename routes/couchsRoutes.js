// change file name to "coachesRoutes.js"
const express = require('express')
const router = express.Router()
const employesController = require('../Controllers/employesController')

router.route('/')
    
    // change "getCouchs" to "getCoaches"
    .get(employesController.getCouchs)
    
    

module.exports = router