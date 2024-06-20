const express = require('express')
const router = express.Router()
const clientsController = require('../Controllers/clientsController')




router.route('/')
    
    .post(clientsController.createNewClient)

    .delete(clientsController.deleteClient)

    router.route('/:id')
    .patch(clientsController.updateClient) 

module.exports = router

