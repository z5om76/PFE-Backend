const Subs = require('../models/Subs')
const asyncHandler = require('express-async-handler')



const getAllSubs = asyncHandler(async (req, res) => {
    // Get all subs from MongoDB
    const subs = await Sub.find()

    // If no subs 
    if (!subs?.length) {
        return res.status(400).json({ message: 'No subs found' })
    }

    res.json(subs)
})



const createNewSub = asyncHandler(async (req, res) => {
    const { Type, Client, Employee} = req.body

    // Confirm data
    if (!Type) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate subname
    const duplicate = await Sub.findOne({ Client }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate subname' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const subObject = { subname, "password": hashedPwd, job }

    // Create and store new sub 
    const sub = await Sub.create(subObject)

    if (sub) { //created 
        res.status(201).json({ message: `New sub ${subname} created` })
    } else {
        res.status(400).json({ message: 'Invalid sub data received' })
    }
})


const deleteSub = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Sub ID Required' })
    }

    // Does the sub still have assigned notes?
    const note = await Note.findOne({ sub: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Sub has assigned notes' })
    }

    // Does the sub exist to delete?
    const sub = await Sub.findById(id).exec()

    if (!sub) {
        return res.status(400).json({ message: 'Sub not found' })
    }

    const result = await sub.deleteOne()

    const reply = `Subname ${result.subname} with ID ${result._id} deleted`

    res.json(reply)
})



module.exports = {

    getAllSubs,
    createNewSub,
    deleteSub
}