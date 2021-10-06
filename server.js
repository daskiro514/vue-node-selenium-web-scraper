const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const compression = require("compression")

const app = express()

const auth = require('./middleware/auth')

// Connect Database
connectDB()

// Init Middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/match', auth, require('./routes/api/match'))
app.use('/api/tips25', auth, require('./routes/api/tips25'))

// Serve frontend built
app.use(express.static(__dirname + '/client/dist'))

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/dist/index.html')
})

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/dist'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
