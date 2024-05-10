const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    clientname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    mail: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('Client', clientSchema)