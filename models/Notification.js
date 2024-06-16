const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
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
      notificationDate: {
        type: Date,
        required: true
      },

      description: {
        type: String,
        required: true
      },
      
      active: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('notification', notificationSchema)