const express = require('express')
const router = express.Router()
const {
    register,
    registerShop,
    registerAdmin,
    registerCompany,
    shopList,
    companyList
    } = require('../controller/appController')

router.post('/register',register)

router.post('/register/Shop', registerShop)

router.post('/register/admin', registerAdmin)

router.post('/register/company', registerCompany)

router.get('/shop', shopList)

router.get('/company', companyList)

module.exports = router