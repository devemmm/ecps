require('./db/db')
const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const authenticationRoutes = require('./routers/authenticationRoutes')
const adminRoutes = require('./routers/adminRoutes')
const hrRoutes = require('./routers/hrRoutes')
const shopRoutes = require('./routers/shopRoutes')
const employeeRoutes = require('./routers/employeeRoutes')


const app = express()

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, './public')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(publicDirectoryPath))

const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title: "ESPC powerd by Next Step Africa",
            version: "1.0.0",
            description: "This API will guide you well how to integrate ecps-api in your project"
        },
        servers:[
            {
                url: `${process.env.SITE_URL}`
            }
        ]
        
    },
    apis:["./src/routers/*.js"]
}

const specs =swaggerJsDoc(options)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

app.use(authenticationRoutes)
app.use(adminRoutes)
app.use(hrRoutes)
app.use(shopRoutes)
app.use(employeeRoutes)

app.listen(port, ()=>console.log(`Server is running on port ${port}`))
