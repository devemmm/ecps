const Admin = require('../models/Admin')
const Company = require('../models/Company')
const Employee = require('../models/Employee')
const Shop = require('../models/Shop')
const Product = require('../models/Product')
const { generateUid } = require('../components/generateUi')
const {requireAuth } = require('../middleware/reqAuth')
const { 
    isExistCompany, 
    isExistEmployee, 
    isExistShop, 
    isExistProduct
} = require('../helps/booleanFunction')

const index = [
    (req, res)=>{
        res.json({
            status: 200,
            message: 'welcome',
            coppright: 'NSA-nextstepafrica',
            post:{
                message: 'for developer',
                usertype:{
                    admin: 3,
                    manager: 2,
                    employee: 1,
                    shop: 0
                },
                uid:{
                    message: 'user id length this id will be generated by system algorith',
                    admin: 4,
                    company:5,
                    employee: 6,
                    shop:7,
                    product:3,
                    order:3,
                    example: 'for admin {uid : 1000}, for company {uid: 10000}, for product {uid: 1000}, etc'
                },
                routes:{
                    method:{
                        post:{
                            '/': 'index route',
                            '/register': 'private route for register Super admin of system',
                            '/register/Shop': 'ready documentetion on /.doc',
                            '/register/product': 'ready documentetion on /.doc',
                            '/register/admin': 'ready documentetion on /.doc',
                            '/register/company': 'ready documentetion on /.doc',
                            '/register/Employee': 'ready documentetion on /.doc'
                        },
                        get:{
                           '/': 'this guidance',
                           '/user/product': '/return array object of all product' 
                        }
                    }
                }
            }
        })
    }
]

const signin = [
    async(req, res)=>{

      const {uid, password} = req.body

      if(!uid || !password){
        return res.json(522).json({error: 'You must specify both User id and password'})
      }

      switch (uid.toString().length) {
        case 4 :
            try {
                const admin = await Admin.findByCredentials(uid , password)
                const token = await admin.generateAuthToken()
                
                res.send({admin, token})
            } catch (error) {
                res.status(400).json({error: error.message})
            }
          break;
        case 6: 
            try{
                const employee = await Employee.findByCredentials(uid , password)
                const token = await employee.generateAuthToken()
                
                const { userType } = employee

                userType === 2 ? res.send({manager : employee, token}) : res.send({employee, token})
            }catch(error){
                res.status(400).json({error: error.message})
            }
            break;
        case 7:
            try {
                const shop = await Shop.findByCredentials(uid , password)
                const token = await shop.generateAuthToken()
                
                res.send({shop, token})
            } catch (error) {
                res.status(400).json({error: {error: error.message}})
            }
            break;
        default:
            res.json({ error: { message: 'Wrong credential'}})
      }
    }
]


const register = [
    async(req, res)=>{

        var {names, phone, email, nid} = req.body
        try {

            // validate All System Admin Specification
            if(!names || !phone || !email || !nid){
                throw new Error('missing some required information')
            }
            
            req.body.uid = await generateUid('Admin')
            req.body.password = 'admin@12345'
            const admin = new Admin({
                ...req.body,
            })

            try {
                await admin.save()
                const token =  await admin.generateAuthToken()
                
                res.status(201).json({message: 'creating system admin successfull', admin, token})
            } catch (error) {
                throw new Error('already there is onther admin registered with this national Id')
            }
        } catch (error) {
            res.status(400).json({error: {error: error.message}})
        }
    }
]

const registerAdmin =  [
    requireAuth, async(req, res)=>{

        var {names, phone, email, nid} = req.body
        try {

            // validate All System Admin Specification
            if(!names || !phone || !email || !nid){
                throw new Error('missing some required information')
            }
            
            // req.body.uid = await generateUid('Admin')
            req.body.uid = await generateUid('Admin')

            req.body.password = 'admin@12345'
            req.body.userType = 3
            const admin = new Admin({
                ...req.body,
            })

            try {
                await admin.save()
                const token =  await admin.generateAuthToken()
                
                res.status(201).json({message: 'creating system admin successfull', admin, token})
            } catch (error) {
                res.status(400).json({error: 'already there is onther admin registered with this national Id'})
            }
        } catch (error) {
            return res.status(400).json({error: {error: error.message}})
        }
    }
]


const registerCompany = [
    requireAuth, async(req, res)=>{
        var {name, tinNumber} = req.body
        var {names, nid, phone, email} = req.body


        try {
            const {uid} = req.admin
            if(!uid){
                return res.status(500).json({error: 'you are not allowed to create Company'})
            }

            if(!name || !tinNumber){
                throw new Error('missing some required information')
            }
            // validate Manager profile
            if(!names || !nid || !phone || !email){
                throw new Error('Manager information is missing')
            }

            req.body.cid = await generateUid('Company')

            const company = new Company({
                name,
                tinNumber,
                cid: req.body.cid,
                employee : { uid: await generateUid('Employee')}
            })

            const manager = new Employee({
                names,
                nid,
                phone,
                email,
                password: 'hr@12345',
                userType: 2,
                cid: req.body.cid,
                uid: await generateUid('Employee')
            })

            try {

                try {
                    //check if manager exist
                    const employee = await Employee.findOne({nid})

                    if(employee){
                        return res.status(401).json({error: "Manager already exist"})
                    }
                    await company.save()
                } catch (error) {
                    return res.status(401).json({error: "Company already exist"})
                }

                await manager.save()
                const token =  await manager.generateAuthToken()
                res.status(201).json({message: 'Company created Successfull', company, manager, token})
            } catch (error) {
                res.status(401).json({error: "Company Management error"})
            }
        } catch (error) {
            res.status(400).send({error: {error: error.message}})
        }
        
    }
]

const registerEmployee = [
    requireAuth, async (req, res)=>{
        const {userType, cid} = req.employee

        if(userType != 2){
            return res.status(500).json({error: {message: 'You can not Register new Employee'}})
        }

        var {nid, names, phone, email} = req.body
        

        try {
            if(!nid || !names || !phone || !email){
                throw new Error('missing some required information')
            }
    
            // find if employee aready registerd by nid
            const isValidEmployee = await isExistEmployee(nid)
            const isValidCompany = await isExistCompany(cid)

            if(!isValidCompany){
                throw new Error('Company Not Exist')
            }

            if(isValidEmployee){
                throw new Error('Employee already Registerd')
            }

            const employee = new Employee({
                names,
                nid,
                phone,
                email,
                password: 'employee@12345',
                userType: 1,
                cid,
                uid: await generateUid('Employee')
            })
            
            await employee.save()
            const token = await employee.generateAuthToken()

            // update Company List by Ading this new Employee
            const company = await Company.findOne({cid})
            company.employee = company.employee.concat({uid: employee.uid})

            await company.save()

            res.status(201).json({message: 'Employee Regististed Successfull', employee, token})
        } catch (error) {
            res.status(400).json({error: {error: error.message}})
        }
    }
]

const registerShop = [
    requireAuth, async(req, res)=>{
        const admin = req.admin

        if(!admin){
            return res.status(500).json({error: {message: 'No Access To create Shop'}})
        }

        // check body === Shop Details
        const { nid, names, phone, email, tinNumber } = req.body
        
        try {
            if(!nid || !names || !phone || !email || !tinNumber){
                return res.status(500).json({error: {message: 'Missing some shop Details'}})
            }
        
            if(await isExistShop(tinNumber)){
                return res.status(500).json({error: {message: 'Shop Already Exist'}})
            }
            const shop = new Shop({
                nid,
                names,
                phone,
                email,
                tinNumber,
                uid: await generateUid('Shop'),
                password: "shop@12345",
                userType: 0,
            })
            
            await shop.save()
            const token = await shop.generateAuthToken()

            res.status(201).json({message: 'Shop created', shop, token})
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const registerProduct = [
    requireAuth, async(req, res)=>{
        const shop = req.shop

        if(!shop){
            return res.status(500).json({error: {message: 'No Access To create Product'}})
        }

        const { name, price, photo} = req.body
        if(!name || !price || !photo){
            return res.status(500).json({error: {message: 'Missing some Product Details'}})
        }

        try {
            // Chexk if is valid Product
            if(await isExistProduct()){
                return res.status(500).json({error: {message: 'Product Already Exist'}})
            }

            const uid = req.shop.uid
            const product = new Product({
                name,
                price,
                photo,
                pid: await generateUid('Product', uid),
                sid: uid,
            })
            await product.save()

            //Register Product in Shop
            const shop = await Shop.findOne({uid : uid})
            shop.product = shop.product.concat({pid: product.pid})
            await shop.save()

            res.status(201).json({message: 'Product created', product})
            
        } catch (error) {
            return res.status(500).json({error: {message: error.message}})
        }
    }
]

const findAllProducts = [
    requireAuth, async(req, res)=>{

        try {
            const products = await Product.find({})
            res.status(200).json({status: 200, products})
        } catch (error) {
            res.status(500).json({error: {message: error.message}})
        }
    }
]
module.exports = {
    index,
    signin,
    register,
    registerShop,
    registerProduct,
    registerAdmin,
    registerCompany,
    registerEmployee,
    findAllProducts
}