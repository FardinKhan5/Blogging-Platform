require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const morgan = require('morgan')
const mongoose=require('mongoose')
const returnError=require('./middlewares/error')
const app=express()
const port=process.env.PORT || 3000
const mongoUri=process.env.MONGO_URI
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json({limit:'50mb'}))
app.use(morgan("dev"))
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } }
mongoose.connect(mongoUri,clientOptions)
.then(()=>{
    console.log("Database Connected Successfully")
})
.catch(()=>{
    console.log("Database Connection Failed")
})

// routes
const authRoutes=require('./routes/auth')
const blogRoutes=require('./routes/blog')
app.use('/api/auth',authRoutes)
app.use('/api/blogs',blogRoutes)
app.use(returnError)

module.exports={app,port}