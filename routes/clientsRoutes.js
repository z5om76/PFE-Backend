const express = require('express')
const router = express.Router()
const clientsController = require('../Controllers/clientsController')




router.route('/')
    .get(clientsController.getAllClients)
    .post(clientsController.createNewClient)
    .patch(clientsController.updateClient)
    .delete(clientsController.deleteClient)

module.exports = router