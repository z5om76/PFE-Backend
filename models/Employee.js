
const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    employeename: {
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
    CV: {
        type: String,
        required: true,
      }
})

module.exports = mongoose.model('Employee', EmployeeSchema, 'emlpoyees')


