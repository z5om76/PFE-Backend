const Client = require('../models/Client')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all clients
// @route GET /clients
// @access Private
const getAllClients = asyncHandler(async (req, res) => {
    // Get all clients from MongoDB
    const clients = await Client.find().select('-password').lean()

    // If no clients 
    if (!clients?.length) {
        return res.status(400).json({ message: 'No clients found' })
    }

    res.json(clients)
})

// @desc Create new client
// @route POST /clients
// @access Private
const createNewClient = asyncHandler(async (req, res) => {
    const { clientname, password, mail } = req.body

    // Confirm data
    if (!clientname || !password || !mail) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate clientname
    const duplicate = await Client.findOne({ mail }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate client' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const clientObject = { clientname, "password": hashedPwd, mail }

    // Create and store new client 
    const client = await Client.create(clientObject)

    if (client) { //created 
        res.status(201).json({ message: `New client ${clientname} created` })
    } else {
        res.status(400).json({ message: 'Invalid client data received' })
    }
})

// @desc Update a client
// @route PATCH /clients
// @access Private
const updateClient = asyncHandler(async (req, res) => {
    const { id, clientname, mail, password } = req.body

    // Confirm data 
    if (!id || !clientname ) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the client exist to update?
    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    // Check for duplicate 
    const duplicate = await Client.findOne({ mail }).lean().exec()

    // Allow updates to the original client 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate client' })
    }

    client.clientname = clientname
    

    if (password) {
        // Hash password 
        client.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedClient = await client.save()

    res.json({ message: `${updatedClient.clientname} updated` })
})

// @desc Delete a client
// @route DELETE /clients
// @access Private
const deleteClient = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Client ID Required' })
    }

    // Does the client still have assigned notes?
    
   /* const note = await Note.findOne({ client: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Client has assigned notes' })
    }*/

    // Does the client exist to delete?
    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    const result = await client.deleteOne()

    const reply = `Clientname ${result.clientname} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllClients,
    createNewClient,
    updateClient,
    deleteClient
}