const profile = {
    uid:{
        type: Number,
        trim: true,
        required: true,
        unique: true
    },
    nid:{
        type: Number,
        required: true,
        trim: true
    },
    names: {
        type: String,
        required: true,
        trim: true
    },
    phone:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    avatar:{
        type: String,
        trim: true,
        default: 'https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg'
    },
    userType:{
        type: Number,
        trim: true,
        default: 0
    },
    password:{
        type: String,
        default: '12345'
    }
}

const salaryDetails = {
    salary:{
        type: Number,
        trim: true,
        default: 300000
    },
    credit:{
        type: Number,
        trim: true,
        default: 0
    },
    balance:{
        type: Number,
        trim: true,
        default: 300000
    },
}

const tokens = [{
    token: {
        type: String,
        required: true
    }
}]

module.exports = { profile, salaryDetails, tokens };