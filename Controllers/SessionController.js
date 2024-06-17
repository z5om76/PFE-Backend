const asyncHandler = require('express-async-handler')
const Session = require('../models/Session');
const Subs = require('../models/Subs')



const getSessions = asyncHandler ( async (req, res) => {
  const userId = req.user.id;
  
  const sessions = await Session.find({"userId":userId})
 
  if (!sessions?.length) {
      return res.status(400).json({ message: 'No sessions found' })
  }

  res.json(sessions)
});


const getSubs = asyncHandler ( async (req, res) => {
  const userId = req.user.id;

  const subs = await Subs.find({"userId":userId})

 
  if (!subs?.length) {
      return res.status(400).json({ message: 'No subs found for the user' })
  }

  res.json(subs)
});

const getSessionCount = asyncHandler(async (req, res) => {
  const userId = req.userId; // Get user ID from the request

  // Count sessions for the user with the provided user ID
  const sessionCount = await Session.countDocuments({ "userId": userId });

  res.json({ sessionCount });
});


module.exports = { getSessions , getSubs,  getSessionCount }
