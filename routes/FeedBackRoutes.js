const express = require ('express')
const router = express.Router()
const FeedBackController = require('../Controllers/FeedBackController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


router.route('/')

    .get(FeedBackController.getfeedback)
    .post(FeedBackController.cratefeedback)
    

module.exports = router 