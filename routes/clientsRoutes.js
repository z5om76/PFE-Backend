const express = require('express')
const router = express.Router()
const clientsController = require('../Controllers/clientsController')




router.route('/')
    
    .post(clientsController.createNewClient)
    .patch(clientsController.updateClient)
    .delete(clientsController.deleteClient)

module.exports = router
