const express = require('express')
const imageRouter = require('./routes/image.route')
const cors = require('./cors.js')
const app = express()
const port = 8080

app.use(cors)
app.use(express.json({
  limit: '50mb'
}))
app.use(express.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}))

app.use('/api', imageRouter)

app.listen(port, () => {
  console.log(`Port: ${port}`)
})