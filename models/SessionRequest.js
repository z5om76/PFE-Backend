const mongoose = require('mongoose');

const sessionrequestSchema = new mongoose.Schema({
  Session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
 
  newDate: {
    type: Date,
    required: true
  }
});



module.exports =  mongoose.model('SessionRequest', sessionrequestSchema);