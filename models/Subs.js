const mongoose = require('mongoose')

const subsSchema = new mongoose.Schema({
    Type:{
        type: String,
        enum: ["1 Month", "3 Months", "6 Months"],
        required: true,
      
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

    startDate: {
         type: Date,
        default: Date.now
  },

  endDate: {
    type: Date,
    required: true
  },



})



subsSchema.methods.isExpired = function() {
    return this.endDate < Date.now();}

module.exports = mongoose.model('Subs', subsSchema)
