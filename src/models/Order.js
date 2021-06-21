const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    sid: {
        // Shop id
        type: mongoose.Schema.Types.ObjectId,
        req: true,
        ref: 'Company'
    },
    cid: {
        // Company Id
        type: mongoose.Schema.Types.ObjectId,
        req: true,
        ref: 'Company'
    },
    eid: {
        // Employee Id
        type: mongoose.Schema.Types.ObjectId,
        req: true,
        ref: 'Company'
    },
    pid: {
        // Product Id
        type: String,
        trim: true,
        default: 'Pending'
    },
    orderDate:{
        // Order Time timestamp
        type: Date,
        required: true
    },
    status: {
        // Order status === {Pending, Approved}
        type: String,
        trim: true,
        default: 'Pending'
    }
},{
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;