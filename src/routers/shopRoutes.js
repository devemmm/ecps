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
router.patch('/order', confirmOrder)

module.exports = router