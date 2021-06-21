const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { profile, tokens} = require('../components/moduleComponents')

const {uid, nid, names, phone, email, avatar, userType, password } = profile
const adminSchema = new mongoose.Schema({
    uid,
    nid:{
        type: Number,
        required: true,
        trim: true
    },
    names,
    phone,
    email, 
    avatar,
    userType,
    password,
    tokens
},{
    timestamps: true
})

// adminSchema.virtual('Company', {
//     ref: 'Company',
//     localField: '_id',
//     foreignField: 'owner'
// })

adminSchema.methods.toJSON = function(){
    const admin = this
    const adminObject = admin.toObject()

    // delete adminObject.password

    return adminObject
}

adminSchema.methods.generateAuthToken = async function(){
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString(), uid: admin.uid }, process.env.JWT_SECRET)
    
    admin.tokens = admin.tokens.concat({token})
    await admin.save()

    return token;
}

adminSchema.statics.findByCredentials = async(uid, password) => {

    if (!uid || !password) {
        throw new Error('You must provide email and password')
    }

    const admin = await Admin.findOne({ uid })

    if (!admin) {
        throw new Error('Admin UID Not Found !!!')
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        throw new Error('Wrong Password !!!')
    }

    return admin

}

adminSchema.pre('save', async function(next) {
  const admin = this

  if (admin.isModified('password')) {
      admin.password = await bcrypt.hash(admin.password, 8)
  }

  next()
})

// adminSchema.pre('remove', async function(next) {
//     const admin = this

//     await Task.deleteMany({ owner: admin._id })

//     next()
// })


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

