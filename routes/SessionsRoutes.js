const express = require ('express')
const router = express.Router()
const SessionController = require('../Controllers/SessionController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/checksessions')

    .get(SessionController.getSessions)


module.exports = router 

router.route('/checksubs')

    .get(SessionController.getSubs)


module.exports = router 

router.route('/requestupdate')

    .post(SessionController.Updatesession)


module.exports = router 
