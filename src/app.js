require('./db/db')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authenticationRoutes = require('./routers/authenticationRoutes')
const adminRoutes = require('./routers/adminRoutes')
const hrRoutes = require('./routers/hrRoutes')
const shopRoutes = require('./routers/shopRoutes')
const employeeRoutes = require('./routers/employeeRoutes')


const app = express()

const port = process.env.PORT

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(authenticationRoutes)
app.use(adminRoutes)
app.use(hrRoutes)
app.use(shopRoutes)
app.use(employeeRoutes)


app.listen(port, ()=>console.log(`Server is running on port ${port}`))

