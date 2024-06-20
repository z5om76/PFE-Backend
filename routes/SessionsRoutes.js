const express = require ('express')
const router = express.Router()
const SessionController = require('../Controllers/SessionController')





router.route('/checksessions')
    .get(SessionController.getSessionCount) // This handles getting session count

  
router.route('/getsessions')
    .get(SessionController.getSessions); // This handles getting session details

router.route('/updatesession')
    .post(SessionController.Updatesession) // This handles updating a session

router.route('/checksubs')

    .get(SessionController.getSubs) // This handles getting subscription details


module.exports = router 

