const asyncHandler = require('express-async-handler')
const Session = require('../models/Session');
const cron = require('node-cron');



const getSessions = asyncHandler ( async (req, res) => {
  const {client} = req.body

  const subs = await Session.find({"Client":client})

 
  if (!subs?.length) {
      return res.status(400).json({ message: 'No subs found' })
  }

  res.json(subs)
})






module.exports = { getSessions }
