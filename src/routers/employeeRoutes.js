const express = require('express')
const router = express.Router()
const {
    index,
    notFound,
    findAllProducts,
    proccesCat
    } = require('../controller/appController')

router.get('/', index)

router.get('/user/product', findAllProducts)

router.post('/employee/proccesCat', proccesCat)

router.get('/*', notFound)

router.post('/*', notFound)

router.patch('/*', notFound)

module.exports = router