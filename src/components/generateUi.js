const bcrypt = require('bcrypt')
const Admin = require('../models/Admin')
const Company = require('../models/Company')
const Employee = require('../models/Employee')
const Shop = require('../models/Shop')
const Product = require('../models/Product')
const Order = require('../models/Order')


const generateUid = async(type, id)=>{
    switch(type){
        case 'Admin':
            const team = await Admin.find({}) 

            if(team.length === 0 ){
                return 1000
            }
            
            var teamUid = []
            
            team.forEach(admin => {
                teamUid.push(admin.uid)
            });
            
            teamUid = teamUid.sort((a,b)=> b-a)
                    
            return teamUid[0] + 1
        case 'Company':
            const company = await Company.find({})

            if(company.length ===0){
                return 10000
            }

            var companyCid = []

            company.forEach(company => {
                companyCid.push(company.cid)
            });

            companyCid = companyCid.sort((a,b)=>b-a)

            return companyCid[0] + 1

        case 'Employee':
            const employee = await Employee.find({})

            if(employee.length === 0 ){
                return 100000
            }

            var employeeUid = []

            employee.forEach(employee =>{
                employeeUid.push(employee.uid)
            })

            employeeUid = employeeUid.sort((a,b)=>b-a)

            return employeeUid[0] + 1
        case 'Shop':
            const shop = await Shop.find({})

            if(shop.length === 0 ){
                return 1000000
            }

            var shopUid = []

            shop.forEach(shop =>{
                shopUid.push(shop.uid)
            })

            shopUid = shopUid.sort((a,b)=>b-a)

            return shopUid[0] + 1
        case 'Product':
            const product = await Product.find({sid : id})

            if(product.length === 0 ){
                return 100
            }

            var productUid = []

            product.forEach(product =>{
                productUid.push(product.pid)
            })
            productUid = productUid.sort((a,b)=>b-a)
            return productUid[0] + 1 
        default:
            return null;
    }
}


const encryptPassword = async(password)=>{
    return await bcrypt.hash(password, 8)
}

module.exports = { generateUid , encryptPassword}