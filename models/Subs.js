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
}})

module.exports = mongoose.model('Subs', subsSchema)