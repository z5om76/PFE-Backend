const express = require ('express')
const router = express.Router()
const SubsController = require('../Controllers/SubsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')

    .get(SubsController.getSubs)
    .post(SubsController.createSubs)


module.exports = router 