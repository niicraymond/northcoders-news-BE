const db = require('./db/connection.js')
const express = require('express')
const {getApi} = require('./app/controllers/controller')

const app = express()

app.get('/api', getApi)

module.exports = app
