require('dotenv').config()

const express=require('express')
const app= express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const session=require('express-session')
const flash =require('express-flash')
const MongoDbStore =require('connect-mongo')
const passport =require('passport')

const PORT = process.env.PORT || 3000
const mongoose=require('mongoose')

//Database connection
const url='mongodb://localhost/pizza'
const connection=mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology:true,
}).then(()=>console.log('connection succesfull'))
.catch((err)=>console.log(err));



//sesion config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store: MongoDbStore.create({
        mongoUrl:url
    }),
    saveUninitialized:false,
    cookie:{maxAge:1000 *60 *24} //24hrs
   


}))

//passport config
const passportInit =require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

//Assert

app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
//global middleware
app.use((req,res,next)=>{
    res.locals.session =req.session
    res.locals.user=req.user
    next()

})

app.use(expressLayout)
app.set('views' ,path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

 

app.listen(PORT ,()=> {
    console.log(`Listening on port ${PORT}`)
})