const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const cookieParser = require('cookie-parser')

const app=express()

//database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected'))
    .catch((err)=> console.log('DB not connected', err))

//middleware
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.use('/', require('./routes/authRoutes'))

const PORT = 8000;

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))