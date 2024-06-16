const express = require ('express')
const router = express.Router()
const SessionController = require('../Controllers/SessionController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/checksessions')

    .get(SessionController.getSessionCount)

    .get(SessionController.getSessions)


module.exports = router 