const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
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
    feedbackText: { 
    type: String,
    required: true },

    active: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('FeedBack', feedbackSchema)