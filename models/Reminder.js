const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
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
    Session: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Session'
      },
      reminderDate: {
        type: Date,
        required: true
      },

      description: {
        type: String,
        default: "Your session is starting soon.."
      },
      
      active: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('reminder', reminderSchema)