const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { profile, tokens} = require('../components/moduleComponents')

const {uid, names, phone, email, avatar, userType, password } = profile
const shopSchema = new mongoose.Schema({
    uid,
    nid:{
        type: String,
        trim: true,
        required: true
    },
    names,
    phone,
    email, 
    avatar,
    userType,
    password,
    tokens,
    tinNumber: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    product : [
        {
            pid : {
                type: String,
                trim: true,
                required: true
            }
        }
    ]
},{
    timestamps: true
})

shopSchema.methods.toJSON = function(){
    const shop = this
    const shopObject = shop.toObject()

    delete shopObject.password
    delete shopObject.tokens

    return shopObject
}

shopSchema.methods.generateAuthToken = async function(){
    const shop = this
    const token = jwt.sign({ _id: shop._id.toString(), uid: shop.uid }, process.env.JWT_SECRET)
    
    shop.tokens = shop.tokens.concat({token})
    await shop.save()

    return token;
}

shopSchema.statics.findByCredentials = async(uid, password) => {

    
    if (!uid || !password) {
        throw new Error('You must provide email and password')
    }

    const shop = await Shop.findOne({ uid })

    if (!shop) {
        throw new Error('shop UID Not Found !!!')
    }

    const isMatch = await bcrypt.compare(password, shop.password)

    if (!isMatch) {
        throw new Error('Wrong Password !!!')
    }

    return shop

}

shopSchema.pre('save', async function(next) {
  const shop = this

  if (shop.isModified('password')) {
    shop.password = await bcrypt.hash(shop.password, 8)
  }

  next()
})

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
