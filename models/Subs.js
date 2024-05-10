const mongoose = require('mongoose')

const subsSchema = new mongoose.Schema({
    Type: {
        type: String,
        required: true
    },
    Expire_Time: {
        type: Date,
        required: true
    },
    Client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Clients'
    },
    Employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Employes'
}})

module.exports = mongoose.model('Subs', subsSchema)