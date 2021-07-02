const multer = require('multer')
const Admin = require('../models/Admin')
const Company = require('../models/Company')
const Employee = require('../models/Employee')
const Shop = require('../models/Shop')
const Product = require('../models/Product')
const Order = require('../models/Order')
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
            req.body.userType = 3
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

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/public/product')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
    // filename: function(req, file, cb) {
    //     cb(null, file.originalname)
    // }
    
})

const product = multer({
    storage,
    limits: {
        fieldSize: 2048
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please Upload a Valid File'))
        }

        cb(undefined, true)
    }
})

const registerProduct = [
    requireAuth, product.single('product'), async(req, res)=>{
        const shop = req.shop

        if(!shop){
            return res.status(500).json({error: {message: 'No Access To create Product'}})
        }

        const { name, price} = req.body
        if(!name || !price){
            return res.status(500).json({error: {message: 'Missing some Product Details'}})
        }

        try {
            
            if(!req.file){
                throw new Error("Product Picture must be required")
            }

            const projectHost = "https://ecps.herokuapp.com"

            let path = (req.file.path).replace('src/public', projectHost)
            
            if(process.env.NODE_ENV === "development"){
                path = (req.file.path).replace('src/public', process.env.SITE_URL)
            }
            

            // Chexk if is valid Product
            if(await isExistProduct()){
                return res.status(500).json({error: {message: 'Product Already Exist'}})
            }

            const uid = req.shop.uid
            const product = new Product({
                name,
                price,
                photo : path,
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

const proccesCat = [
    requireAuth, async(req, res)=>{
        try {
            
            // Extract company id {cid}, employee {eid} from Authorised Employee
            const { cid, uid } = req.employee
            
            // Generate order id 
            const oid = await generateUid("Order")

            // extract shop id {sid} product id {pid} name {name} price {price} from every product in cat
            const cat = req.body

            if(cat.length === 0 ){
                throw new Error("Cat is Empty")
            }

            // create order 
            cat.forEach( async product => {
                const { sid, pid, name, price } = product
                if(!sid || !pid || !name || !price){
                    throw new Error("missing some Product Details")
                }
                const order = new Order({
                    oid,
                    sid,
                    cid,
                    uid,
                    pid,
                    name,
                    price
                })
                // console.log(order)

                await order.save()
            });

            res.status(200).json({message: 'Cat Procced'})
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const allOrder = [
    requireAuth, async(req, res)=>{
        try {
            const admin = req.admin
            if(!admin){
                throw new Error("You haven't permission to list Employee Order")
            }
            const order = await Order.find({})
            res.status(200).json({order})
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const allOrderByShop = [
    requireAuth, async(req, res)=>{
        try {
            const shop = req.shop
            if(!shop){
                throw new Error("You haven't permission to list Employee Order")
            }
            const order = await Order.find({sid: shop.uid})
            res.status(200).json({order})
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const getEmployeeOrder = [
    requireAuth, async(req, res)=>{
        try {
            const employee = req.employee
            if(employee.userType != 2){
                throw new Error("You haven't permission to list Employee Order")
            }
            const order = await Order.find({cid: employee.cid})
            res.status(200).json({order})
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]


const shopList = [
    requireAuth, async(req, res)=>{
        try {
            const admin = req.admin
            if(!admin){
                throw new Error("You haven't permission to list shop")
            }

            const shops = await Shop.find({})
            res.status(200).json(shops)
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const companyList = [
    requireAuth, async(req, res)=>{
        try {
            const admin = req.admin
            if(!admin){
                throw new Error("You haven't permission to list shop")
            }

            const companies = await Company.find({})
            res.status(200).json(companies)
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const employeeList = [
    requireAuth, async(req, res)=>{
        try {
            const employee = req.employee
            if(employee.userType !=2){
                throw new Error("You haven't permission to list Employee")
            }

            const employees = await Employee.find({cid: employee.cid})
            res.status(200).json(employees)
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const confirmOrder = [
    requireAuth, async(req, res)=>{
        try {
            const shop = req.shop 
            const { uid } = req.params
            const { oid, pid } = req.query

            if(!oid || !pid){
                throw new Error("Missing Some Required Information in your Request")
            }

            if(!shop){
                throw new Error("You haven't permission to confirm this Order")
            }

            const order  = await Order.findOne({sid: shop.uid, oid, pid, uid})

            if(!order){
                throw new Error("Order not found")
            }

            if(order.status === "Completed"){
                throw new Error("Order Already Completed")
            }

            const employee = await Employee.findOne({uid : order.uid})

            if(!employee){
                throw new Error("Internal Server error there is no Employee Found")
            }

            try {
                
                const {salary, credit, balance } = employee.salaryDetails
                
                if(balance < order.price){
                    throw new Error("Insufficiency Balance")
                }

                employee.salaryDetails.credit = credit + order.price
                employee.salaryDetails.balance = salary - employee.salaryDetails.credit

                await employee.save()

                order.status = "Completed"
                await order.save()
                return res.status(200).json({order, employee})
            } catch (error) {
                return res.status(400).json({error: {message: error.message}})
            }
            
            res.status(200).json({message: 'system under maintainance'})
        } catch (error) {
            res.status(400).json({error: {message: error.message}})
        }
    }
]

const notFound = [
    (req, res)=>{
        res.json({status: 404, message: 'Page not Found'})
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
    findAllProducts,
    proccesCat,
    allOrder,
    allOrderByShop,
    getEmployeeOrder,
    shopList,
    companyList,
    employeeList,
    confirmOrder,
    notFound
}
