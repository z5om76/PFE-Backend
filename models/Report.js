const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    reportText: { 
        type: String,
        required: true },
})

module.exports = mongoose.model('Report', reportSchema)