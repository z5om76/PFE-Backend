const asyncHandler = require('express-async-handler')
const FeedBack = require('../models/FeedBack')


const cratefeedback = asyncHandler ( async (req, res) => {

    const {client , employee , description} = req.body

    if(!client || !employee || !description){
        return res.status(400).json({ message: 'All fields are required' })
    }

    const feedbackObject = { "Client" : client , "Employee": employee ," feedbackText": description}

    const feedback = await FeedBack.create(feedbackObject)

    if (feedback) { //created 
        res.status(201).json({ message: `New FeedBack has been created` })
    } else {
        res.status(400).json({ message: 'Invalid Feedback data received' })
    }

})


const getfeedback = asyncHandler ( async (req, res) => {

    const {employee} = req.body
  
    const feedback = await FeedBack.find({"Emlpoyee":employee})

    if (!feedback?.length) {
        return res.status(400).json({ message: 'No FeedBacks found' })
    }

    const activefeedbacks = feedback.filter(feedback => feedback.active);

        // Check if there are any inactive notifications
        if (activefeedbacks.length === 0) {
            return res.status(400).json({ message: 'No active FeedBacks found' });}

    
            return res.json(activeNotifications);


})

module.exports = {
    getfeedback,
    cratefeedback
}