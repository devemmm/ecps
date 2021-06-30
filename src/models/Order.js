const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    oid :{
        // Shop id
        type: Number,
        req: true,
        required: true
    },
    sid: {
        // Shop id
        type: Number,
        req: true,
        ref: 'Company'
    },
    cid: {
        // Company Id
        type: Number,
        req: true,
        ref: 'Company'
    },
    uid: {
        // Employee user Id
        type: Number,
        req: true,
        ref: 'Company'
    },
    pid: {
        // Product Id
        type: Number,
        trim: true,
        default: 'Pending'
    },
    name: {
        // Product Name
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    orderDate:{
        type: String,
        default : new Date()
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