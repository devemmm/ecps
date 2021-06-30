const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, ({
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})).then(()=>{
    console.log('Connected to Database')
}).catch(()=>{
    console.log('Unable to Connect to Database try Again !')
})