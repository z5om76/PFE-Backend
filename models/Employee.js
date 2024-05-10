
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
        required: true, 
    },
})

module.exports = mongoose.model('Emlpoyee', EmployeeSchema)
