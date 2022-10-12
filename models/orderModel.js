const mongoose = require('mongoose')

const orderSchema = mongoose.Schema( {
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Euser'
    },
    address: String,
    mobile: String,
    cart: Array,
    total: Number,
    paymentId: String,
    method: String,
    delivered: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    dateOfPayment: Date
}, { timestamps: true } )

module.exports = mongoose.model('eorder', orderSchema )