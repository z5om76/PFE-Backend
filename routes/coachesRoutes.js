const express = require('express')
const router = express.Router()
const employesController = require('../Controllers/employesController')

router.route('/therapist')
    
      .get(employesController.getTherapist)
    
    

module.exports = router

router.route('/SCC')
    
      .get(employesController.getSCC)
    
    

module.exports = router

router.route('/SSC')
    
      .get(employesController.getSSC)
    
    

module.exports = router

router.route('/FCSC')
    
      .get(employesController.getFCSC)
    
    

module.exports = router
