const express = require('express')
const { 
    index,
    signin, 
    register, 
    registerShop,
    registerProduct,
    registerAdmin, 
    registerCompany, 
    registerEmployee,
    findAllProducts
    } = require('../controller/appController')

const router = express.Router()

router.get('/', index)

router.post('/signin', signin)

router.post('/register',register)

router.post('/register/Shop', registerShop)

router.post('/register/product', registerProduct)

router.post('/register/admin', registerAdmin)

router.post('/register/company', registerCompany)

router.post('/register/Employee', registerEmployee)

router.get('/user/product', findAllProducts)





module.exports = router