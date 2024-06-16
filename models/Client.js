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

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    stripeCustomerId: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
})

module.exports = mongoose.model('Client', clientSchema)
