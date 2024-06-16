const asyncHandler = require('express-async-handler')
const Session = require('../models/Session');
const Subs = require('../models/Subs')



const getSessions = asyncHandler ( async (req, res) => {
  const {client} = req.body

  const sessions = await Session.find({"Client":client})

 
  if (!sessions?.length) {
      return res.status(400).json({ message: 'No sessions found' })
  }

  res.json(sessions)
})


const getSubs = asyncHandler ( async (req, res) => {
  const {client} = req.body

  const subs = await Subs.find({"Client":client})

 
  if (!subs?.length) {
      return res.status(400).json({ message: 'No subs found' })
  }

  res.json(subs)
})





module.exports = { getSessions , getSubs }
