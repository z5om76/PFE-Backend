const Client = require('../models/Client')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

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
    const { clientname, password, email } = req.body

    // Confirm data
    if (!clientname || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate clientname
    const duplicate = await Client.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate client' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    const clientObject = { clientname, "password": hashedPwd, email , stripeCustomerId: customer.id }

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
    const { id } = req.params;

    const { clientname, email, password } = req.body


    let image;

  if (req.file) {
    image = req.file.path; // or any other logic to store the image path
  }

    // Does the client exist to update?
    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }


    if (email && email !== client.email) {
        // Check for duplicate 
        const duplicate = await Client.findOne({ email }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate email' });
        }
        client.email = email;
    }   

    


    if(clientname)
    {
      client.clientname = clientname
    }
    
    if (image){
        client.image= image
        
    }

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
