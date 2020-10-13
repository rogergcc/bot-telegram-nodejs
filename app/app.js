const express = require('express')
// const morgan = require('morgan')
// const createError = require('http-errors')
const bodyParser= require('body-parser');
// require('dotenv').config()
// const path = require('path')
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN || ''
const sendMessage = require('./utils/telegrambot');

const App = express()


// App.use(express.static(path.join(__dirname, 'public')))
// App.use(express.json())
// App.use(express.urlencoded({ extended: false }))
                

App.use(bodyParser.json())
// App.use(morgan('dev'))
App.use(express.json())
App.use(express.urlencoded({ extended: true }))


App.get('/', async (req, res, next) => {
    res.send('Hello W0rld')
})

App.post('/webhooks/telegram', (req, res, next) => {
    console.log(req.body);

    const requestMessage = req.body;
    
    const sendMessageData = {
        conversationId: requestMessage.chat_id,
        text: `Hola Q talll!!!!`
      }

    sendMessage(sendMessageData);

    res.send({status:"ok"});

});
//https://telegram-bot-api-hunter.herokuapp.com/webhooks/telegram

// App.use(async(req,res,next)=>{

//     // next(createError.NotFound('This route doesnt exist'))
//     next(createError.NotFound())
// })

App.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

module.exports = App;