const asyncHandler = require('express-async-handler')
const Report = require('../models/Report');


const createreport = asyncHandler(async(req,res)=>{
    const {reportText} = req.body;

    if (!reportText) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    
    const reportObject ={reportText}

    const report =  await Report.create(reportObject)

    if (report) { //created 
        res.status(201).json({ message: `New report has been created` })
    } else {
        res.status(400).json({ message: 'Invalid client data received' })
    }
})

module.exports = {createreport}