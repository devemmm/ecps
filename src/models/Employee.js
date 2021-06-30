const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { profile, salaryDetails, tokens } = require('../components/moduleComponents')
const {uid, nid, names, phone, email, avatar, userType, password } = profile
const { salary, credit, balance } = salaryDetails
const employeeSchema = new mongoose.Schema({
    uid,
    nid,
    names,
    phone,
    email, 
    avatar,
    userType,
    password,
    tokens,
    salaryDetails:{
        salary,
        credit, 
        balance
    },
    cid: {
        type: Number,
        required: true,
        trim: true
    },
    c_id: {
        type: mongoose.Schema.Types.ObjectId,
        req: true,
        ref: 'Company'
    },
},{
    timestamps: true
})

employeeSchema.methods.toJSON = function(){
    const employee = this
    const employeeObject = employee.toObject()

    delete employeeObject.password
    delete employeeObject.tokens

    return employeeObject
}

employeeSchema.methods.generateAuthToken = async function(){
    const employee = this
    const token = jwt.sign({ _id: employee._id.toString(), uid: employee.uid, cid : employee.cid }, process.env.JWT_SECRET)
    
    employee.tokens = employee.tokens.concat({token})
    await employee.save()

    return token;
}

employeeSchema.statics.findByCredentials = async(uid, password) => {

    
    if (!uid || !password) {
        throw new Error('You must provide email and password')
    }

    const employee = await Employee.findOne({ uid })

    if (!employee) {
        throw new Error('employee UID Not Found !!!')
    }

    const isMatch = await bcrypt.compare(password, employee.password)

    if (!isMatch) {
        throw new Error('Wrong Password !!!')
    }

    return employee

}

employeeSchema.pre('save', async function(next) {
  const employee = this

  if (employee.isModified('password')) {
    employee.password = await bcrypt.hash(employee.password, 8)
  }

  next()
})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;