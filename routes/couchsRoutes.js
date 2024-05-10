const express = require('express')
const router = express.Router()
const employesController = require('../Controllers/employesController')

router.route('/')
    
    .get(employesController.getCouchs)
    
    

module.exports = router