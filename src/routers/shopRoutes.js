const express = require('express')
const router = express.Router()
const {
    registerProduct,
    allOrderByShop,
    confirmOrder
    } = require('../controller/appController')

router.post('/register/product', registerProduct)

router.get('/shop/order', allOrderByShop)

// confirm Order
//require oid and pid as a query string

router.patch('/order/:uid', confirmOrder)

module.exports = router