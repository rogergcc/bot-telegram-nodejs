const express= require('express')
// const morgan = require('morgan')
// const createError = require('http-errors')

// require('dotenv').config()


const app= express()
// app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', async (req, res, next) => {
    res.send('Hello Wrld')
  })
  

// app.use(async(req,res,next)=>{

//     // next(createError.NotFound('This route doesnt exist'))
//     next(createError.NotFound())
// })

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message:err.message
        }
    })
})


const PORT = process.env.PORT || 3002

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    console.log(`localhost:${PORT}`)
})

