const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./controllers/queries')
const port = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/persons', db.getUsers)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
