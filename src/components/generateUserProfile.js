const generateDefaultProfile = (req)=>{
    var profile = {
        uid: null,
        nid: null,
        names: null,
        phone: null,
        email: null,
        userType: 0,
        password: null
    }
    profile.names = req.body.names
    profile.phone = req.body.phone
    profile.email = req.body.email
    profile.nid = req.body.nid

    return profile;
}
const generateProfile = (req, userType)=>{
    var profile = generateDefaultProfile(req)
    switch(userType){
        case 'Admin': 
            // profile.uid = req.body.uid
            profile.uid = 1000
            profile.password = 'hello'
            profile.userType = 5

            // Bind profile to the Request
            req.profile = profile
            return req;
        case 'Employee':
            var uid = 1000
            profile.uid = uid
            profile.password = "12345"
            profile.userType = 5
            
            // Bind profile to the Request
            req.profile = profile
            const salaryDetails = {

            }
            req.salaryDetails
            return req;
        default:
            return req;
    }
}



module.exports = {generateProfile}