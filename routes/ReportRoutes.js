const express = require ('express')
const router = express.Router()
const ReportController = require('../Controllers/ReportController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')

    .post(ReportController.createreport)
    

module.exports = router 