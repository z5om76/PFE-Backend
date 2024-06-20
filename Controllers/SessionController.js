const asyncHandler = require('express-async-handler')
const Session = require('../models/Session');
const Subs = require('../models/Subs')
const SessionRequest = require('../models/SessionRequest')



const getSessions = asyncHandler ( async (req, res) => {
  const userId = req.userId;



  const sessions = await Session.find({"userId":userId})
 
  if (!sessions?.length) {
      return res.status(400).json({ message: 'No sessions found' })
  }

  res.json(sessions)
});


const getSubs = asyncHandler ( async (req, res) => {
  const userId = req.userId;

  const subs = await Subs.find({"userId":userId})
  if (!subs?.length) {
      return res.status(400).json({ message: 'No subs found for the user' })
  }

  res.json(subs)
});

const Updatesession = asyncHandler(async(req , res) => {
  const {id,newdate} = req.body

  const session = await Session.findById(id)
  

  if(!session){
    return res.status(400).json({message:'No session found'})
  }

  const duplicate = await Session.findOne({ "id" : id ,"sessionDate" : newdate }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate client' })
    }

    const sessionObject ={"Session": id , "newDate": newdate}

    const sessionrequest = await SessionRequest.create(sessionObject)

    if (sessionrequest) { //created 
      res.status(201).json({ message: 'New Session Request has been created' })
  } else {
      res.status(400).json({ message: 'Invalid Session data received' })
  }


})

const getSessionCount = asyncHandler(async (req, res) => {
  const userId = req.userId; // Get user ID from the request


  // Count sessions for the user with the provided user ID
  const sessionCount = await Session.countDocuments({ "userId": userId });

  res.json({ sessionCount });
});


module.exports = { getSessions , getSubs,  getSessionCount, Updatesession }
