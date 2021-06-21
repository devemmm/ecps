const mongoose = require('mongoose')
const Employee = require('./Employee')

const companySchema = new mongoose.Schema({
    cid:{
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    tinNumber: {
        type: Number,
        trim: true,
        required: true,
        unique: true
    },
    employee: [{
        uid: {
            type: Number,
            strim: true,
            required: true
        }
    }]
},{
    timestamps: true
})

companySchema.virtual('employees', {
    ref: 'Employee',
    localField: 'cid',
    foreignField: 'c_id'
})

const Company = mongoose.model('Company', companySchema);

module.exports = Company;