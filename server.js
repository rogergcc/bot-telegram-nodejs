const express = require('express');

// const bodyParser = require('body-parser');

const path = require('path')



// "body-parser": "^1.19.0",
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
                


app.get('/', async (req, res, next) => {
  res.render('index')
})


const PORT = process.env.PORT;


app.listen(PORT, () => {

    console.log(`Server listening on port ${PORT}`);
    console.log(`localhost:${PORT}`);
});

// Heroku git steps deploy
// https://devcenter.heroku.com/articles/git