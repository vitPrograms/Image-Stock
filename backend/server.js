const express = require('express')
const imageRouter = require('./routes/image.route')
const bodyParser = require('body-parser')
const cors = require('./cors.js')
const app = express()
const port = 8080

app.use(cors)
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', imageRouter)

app.listen(port, () => {
  console.log(`Port: ${port}`)
})