const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  Sub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subs',
    required: true
  },
  Client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Client'
},

Employee: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref:'Employee'
},

sessionDate: {
    type: Date,
    required: true
  },

  meetLink: { 
    type: String, 
    required: false }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
