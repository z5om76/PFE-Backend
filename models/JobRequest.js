const mongoose = require('mongoose')

const jobrequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    job: {
        type: String,
        enum: ["Therapist", "Soft Skills Coach", "Self Care Coach", "Family and Community Support Coach"],
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
      },
    CV: {
        type: String,
        required: true,
      }
})

module.exports = mongoose.model('JobRequest', jobrequestSchema)