const express = require('express')
const router = express.Router()
const { signin } = require('../controller/appController')

router.post('/signin', signin)

module.exports = router