const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    rol: {
        type: String,
        default: 'usuario'
    },
    Last_conecction:{
        type: Date,
        default: Date.now
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts'
    },
    documents: {
        name: String,
        reference: String
    }
})

module.exports = mongoose.model('User', schema, 'users')