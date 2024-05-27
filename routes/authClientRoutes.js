const express = require('express')
const router = express.Router()
const authClientController = require('../Controllers/authClientController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/')
    .post(loginLimiter, authClientController.login)

router.route('/refresh')
    .get(authClientController.refresh)

router.route('/logout')
    .post(authClientController.logout)

module.exports = router