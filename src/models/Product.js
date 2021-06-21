const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    pid:{
        type: Number,
        trim: true,
        required: true
    },
    sid : {
        type: String,
        trim: true,
        required: true
    },
    name:{
        type: String,
        trim: true,
        required: true
    },
    price:{
        type: Number,
        trim: true,
        required: true
    },
    photo:{
        type: String,
        trim: true,
        required: true
    }
},{
    timestamps: true
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;