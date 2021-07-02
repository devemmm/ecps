const express = require('express')
const router = express.Router()
const {
    registerProduct,
    allOrderByShop,
    confirmOrder
    } = require('../controller/appController')

    /**
 * @swagger
 * components:
 *   schemas:
 *     Shop:
 *       type: object
 *       required:
 *         - tinNumber
 *         - nid
 *         - names
 *         - phone
 *         - nid
 *         - email
 *       properties:
 *         uid:
 *           type: Number
 *           description: User Id of the Shop owner shold be created by system automatical and leng must be 7
 *         nid:
 *           type: Number
 *           description: National Id of the shop owner
 *         names:
 *           type: string
 *           description: Full Name of the shop owner
 *         phone:
 *           type: string
 *           description: Phone Number of the shop owner
 *         email: 
 *           type: string
 *           description: Email of the shop owner
 *         avatar:
 *           type: string
 *           description: url of the profile picture
 *         userType:
 *           type: Number
 *           description: User type of the User
 *         password:
 *           type: string
 *           description: Password of the user but it is hidden
 *         tokens:
 *           type: Array
 *           description: Array of User token but it is hidden
 *         tinNumber:
 *           type: string
 *           description: Tin NUmber of the shop
 *         product:
 *           type: Array
 *           description: Array of product for this Shop
 *         timestamps:
 *           type: Object
 *           description: timestamps of shop creation and updated
 *       example:
 *         uid: 1000000
 *         nid: 1200080061636122
 *         names: NTIVUGURUZWA Emmanuel
 *         phone: 0788596281
 *         email: djntivuguruzwaemmanuel@gmail.com
 *         avatar: https://ecps.nextreflexe.com/kwqgbu121321421.jpg
 *         userType: 0
 *         product: []
 *         token: qdqwbkgfwvfehwqwkdwhefwkfhw,qwvgkdwqvdgwqMDVGDFWFGWMWFGWFH
 *     Product:
 *       type: object
 *       properties:
 *         uid:
 *           type: number
 *           description: "kewbfgw"
 *         name:
 *           type: string
 *           description: "kewbfgw"
 *         price:
 *           type: number
 *           description: "kewbfgw"
 *         photo:
 *           type: string
 *           description: "kewbfgw"
 *         pid:
 *           type: number
 *           description: "kewbfgw"
 *         sid:
 *           type: number
 *           description: "kewbfgw"
 *         createdAt:
 *           type: string
 *           description: "kewbfgw"
 *         updatedAt:
 *           type: string
 *           description: "kewbfgw"
 *       example:
 *         _id: 60df12d7e27492155270cf64 
 *         name: Pizza 
 *         price: 5000 
 *         photo: http://localhost:3000/product/2021-07-02T13:21:27.134Zpizza_fresca.jpg 
 *         pid: 101 
 *         sid: 1000000
 *         createdAt: 2021-07-02T13:21:27.156Z
 *         updatedAt: 2021-07-02T13:21:27.156Z   
 */

 /**
  * @swagger
  * tags:
  *   name: Shop
  *   description: ECPS-API Shop Route
  */

 /**
  * @swagger
  * tags:
  *   name: Admin
  *   description: ECPS-API Admin Route
  */

/**
 * @swagger
 * /register/product:
 *   post:
 *     summary: This routes will be accessed by Shop Owner only and it will Returns all information of the product
 *     tags: [Shop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {tinNumber: 123456874, names: "NTIVUGURUZWA Emmanuel", phone: 0788596281, nid: 1199880061636122, email: djntivuguruzwaemmanuel@gmail.com}
 *     responses:
 *       200:
 *         description: Product Details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {message: Product Created"}
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Product Details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {error: {message: validation Error }}
 */
router.post('/register/product', registerProduct)

router.get('/shop/order', allOrderByShop)

// confirm Order
//require oid and pid as a query string



router.patch('/order/:uid', confirmOrder)

module.exports = router