const express = require('express')
const router = express.Router()
const employesController = require('../Controllers/employesController')

router.route('/')
    .get(employesController.getAllEmployes)
    .post(employesController.createNewEmployee)
    .patch(employesController.updateEmployee)
    .delete(employesController.deleteEmployee)

module.exports = router