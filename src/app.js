require('./db/db')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const publicRouter = require('./routers/publicRoutes')

const app = express()

const port = process.env.PORT

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(publicRouter)


app.listen(port, ()=>console.log(`Server is running on port ${port}`))

