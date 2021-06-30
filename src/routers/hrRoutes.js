const express = require('express')
const router = express.Router()
const {
    registerEmployee,
    employeeList,
    allOrder,
    getEmployeeOrder
    } = require('../controller/appController')

router.post('/register/Employee', registerEmployee)

router.get('/employee', employeeList)

router.get('/employee/order', allOrder)

router.get('/company/order', getEmployeeOrder)


module.exports = router