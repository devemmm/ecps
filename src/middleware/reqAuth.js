const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const Employee = require('../models/Employee')
const Shop = require('../models/Shop')

const requireAuth = async(req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).send({ error: { message: 'Authorization token is Null' }})
    }
    try {
        const token = authorization.replace('Bearer ', '')

        jwt.verify(token, process.env.JWT_SECRET, async(error, payload) => {
            if (error) {
                return res.status(401).send({ error: { message: 'Authorization token is invalid' }})
            }

            const { _id, uid } = payload

            switch(uid.toString().length){
                case 4 :
                    const admin = await Admin.findOne({ _id, uid, 'tokens.token': token })

                    if (!admin) {
                        return res.status(401).send({ error: { message: 'Authorization Faild !!! Login Again' }})
                    }

                    req.admin = admin
                    req.admin.token = token
                    return next()
                case 6 : 
                    const { cid } = payload

                    const employee = await Employee.findOne({ _id, uid, cid, 'tokens.token': token })

                    if (!employee) {
                        return res.status(401).send({ error: { message: 'Authorization Faild !!! Login Again' }})
                    }

                    req.employee = employee
                    req.employee.token = token
                    return next()
                case 7 :
                    const shop = await Shop.findOne({_id, 'tokens.token': token })
                
                    if(!shop){
                        return res.status(401).send({ error: { message: 'Authorization Faild !!! Login Again' }})
                    }
                    
                    req.shop = shop
                    req.shop.token = shop
                    return next()
                default:
                    return res.status(401).send({ error: { message: 'System undermentainance' }});
            }
        })
    } catch (error) {
        return res.status(401).send({ error})
    }

}

module.exports = { requireAuth }