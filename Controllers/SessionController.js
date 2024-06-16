const asyncHandler = require('express-async-handler')
const Session = require('../models/Session');
const cron = require('node-cron');



const getSessions = asyncHandler ( async (req, res) => {
  const userId = req.user.id;

  const sessions = await Session.find({"userId":userId})

 
  if (!sessions?.length) {
      return res.status(400).json({ message: 'No sessions found for the user' })
  }

  res.json(sessions)
});

const getSessionCount = asyncHandler(async (req, res) => {
  const userId = req.userId; // Get user ID from the request

  // Count sessions for the user with the provided user ID
  const sessionCount = await Session.countDocuments({ "userId": userId });

  res.json({ sessionCount });
});

module.exports = { getSessions,  getSessionCount}