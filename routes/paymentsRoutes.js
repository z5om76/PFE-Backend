const express = require ('express')
const router = express.Router()
const paymentsController = require('../Controllers/paymentsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


router.route('/prices')

    .get(paymentsController.getPrices)

 
router.route('/session')

    .post(paymentsController.createSubsecription)

module.exports = router;