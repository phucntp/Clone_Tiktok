
const express = require('express')
const morgan = require('morgan')
const connectDb = require('./config/db.js');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDb.connectDb()
app.use(morgan('combined'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})