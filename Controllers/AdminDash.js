const Client = require('../models/Client')
const asyncHandler = require('express-async-handler')
const Employee = require('../models/Employee')
const JobRequest = require("../models/JobRequest")
const SessionRequest = require('../models/SessionRequest')
const Session = require('../models/Session')
const FeedBack = require('../models/FeedBack')
const Report = require('../models/Report')


const getAllClients = asyncHandler(async (req, res) => {
    // Get all clients from MongoDB
    const clients = await Client.find().select('-password').lean()

    // If no clients 
    if (!clients?.length) {
        return res.status(400).json({ message: 'No clients found' })
    }

    res.json(clients)
})



const getAllEmployes = asyncHandler(async (req, res) => {
    // Get all employes from MongoDB
    const employes = await Employee.find().select('-password').lean()

    // If no employes 
    if (!employes?.length) {
        return res.status(400).json({ message: 'No employes found' })
    }

    res.json(employes)
})


const getAllJobRequests = asyncHandler(async (req, res) => {
    // Get all employes from MongoDB
    const jobrequests = await JobRequest.find()

    // If no employes 
    if (!jobrequests?.length) {
        return res.status(400).json({ message: 'No employes found' })
    }

    res.json(jobrequests)
})


const AccpetJobRequest = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Job Request ID Required' })
    }


    const jobrequest= await JobRequest.findById(id)

    if (!jobrequest.name || !jobrequest.password || !jobrequest.job || !jobrequest.email || !jobrequest.image || !jobrequest.CV) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const jemail=jobrequest.email
    // Check for duplicate employeename
    const duplicate = await Employee.findOne({ jemail }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Employee' })
    } 
    

    const employeeObject = { "employeename" : jobrequest.name, "password": jobrequest.password , job : jobrequest.job , email : jobrequest.email , image : jobrequest.image , CV : jobrequest.CV}

    // Create and store new employee 
    const employee = await Employee.create(employeeObject)

    if (employee) { //created 
        res.status(201).json({ message: `New employee ${employeename} created` })
    } else {
        res.status(400).json({ message: 'Invalid employee data received' })
    }
})


const RefuseJobRequest = asyncHandler(async (req, res) => {

    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Job Request ID Required' })
    }

    // Does the employee exist to delete?
    const jobrequest = await JobRequest.findById(id).exec()

    if (!jobrequest) {
        return res.status(400).json({ message: 'Job Request not found' })
    }

    const result = await jobrequest.deleteOne()

    const reply = `Sorry your request has been denied`

    res.json(reply)


})



const getSessionsRequests = asyncHandler(async (req, res) => {
    // Get all employes from MongoDB
    const sessionsrequests = await SessionRequest.find()

    // If no employes 
    if (!sessionsrequests?.length) {
        return res.status(400).json({ message: 'No requests found' })
    }

    res.json(sessionsrequests)
})


const AccpetSessionsRequests = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Job Request ID Required' })
    }


    const sessionrequest= await JobRequest.findById(id)
    const session = await Session.findById(id)

    if (!sessionrequest|| !session) {
        return res.status(400).json({ message: 'No session found' })
    }
   
    session.sessionDate = sessionrequest.newdate

    // Create and store new employee 
    const updatedSession= await session.save()

    if (updatedSession) { //created 
        res.status(201).json({ message: `New Session Date ${newdate} updated` })
    } else {
        res.status(400).json({ message: 'Invalid session request data received' })
    }
})


const RefuseSessionRequest = asyncHandler(async (req, res) => {

    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Job Request ID Required' })
    }

    // Does the employee exist to delete?
    const sessionrequest = await SessionRequest.findById(id).exec()

    if (!sessionrequest) {
        return res.status(400).json({ message: 'Job Request not found' })
    }

    const result = await sessionrequest.deleteOne()

    const reply = `Sorry your request has been denied`

    res.json(reply)


})

const DeleteUser = asyncHandler(async (req, res) => {

    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const User = await Client.findById(id).exec()

    if (!User) {
        const User = await Employee.findById(id).exec()
        if (!User) {
            return res.status(400).json({ message: 'User not found' })
        }
    }
    else{
    return res.status(400).json({ message: 'User not found' })}

    const result = await User.deleteOne()

    const reply = `User has been deleted`

    res.json(reply)
})

const getFeedBack = asyncHandler(async (req, res) => {

    const feedbacks = await FeedBack.find()

    if (!feedbacks?.length) {
        return res.status(400).json({ message: 'No feedbacks found' })
    }

    res.json(feedbacks)

})

const AcceptFeedBack = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'FeedBack ID Required' })
    }


    const feedback= await FeedBack.findById(id)
   

    if (!feedback) {
        return res.status(400).json({ message: 'No session found' })
    }
   
    feedback.active = true;

    // Create and store new employee 
    const updatedSession= await feedback.save()

    if (updatedSession) { //created 
        res.status(201).json({ message: `FeedBack acctepted` })
    } else {
        res.status(400).json({ message: 'Invalid FeedBack data received' })
    }

})

const RefuseFeedBack = asyncHandler(async (req, res) => {

    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'FeedBack ID Required' })
    }

    // Does the employee exist to delete?
    const feedback = await FeedBack.findById(id).exec()

    if (!feedback) {
        return res.status(400).json({ message: 'FeedBack not found' })
    }

    const result = await feedback.deleteOne()

    const reply = `Sorry your FeedBack has things that not match our policies`

    res.json(reply)


})

const getReports = asyncHandler(async (req, res) => {

    const reports = await Report.find()

    if (!reports?.length) {
        return res.status(400).json({ message: 'No reports found' })
    }

    res.json(reports)

})




module.exports = {
    getAllClients,
    getAllEmployes,
    AccpetJobRequest,
    RefuseJobRequest,
    getAllJobRequests,
    getSessionsRequests,
    AccpetSessionsRequests,
    RefuseSessionRequest,
    DeleteUser,
    getFeedBack,
    RefuseFeedBack,
    AcceptFeedBack,
    getReports
}