const Company = require('../models/Company')
const Employee = require('../models/Employee')
const Product = require('../models/Product')
const Shop = require('../models/Shop')

const isExistCompany = async(cid)=>{
    const company = await Company.findOne({cid})

    return company ? true : false
}

const isExistEmployee = async(nid)=>{
    const employee = await Employee.findOne({nid})

    return employee ? true : false
}

const isExistShop = async(tinNumber)=>{
    const shop = await Shop.findOne({tinNumber})
    
    return shop ? true : false
}

const isExistProduct = async(pid, sid)=>{
    const product = await Product.findOne({pid, sid})

    return product ? true : false
}

module.exports = { 
    isExistCompany, 
    isExistEmployee, 
    isExistShop, 
    isExistProduct
}