'use strict'
require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')

const apiKeyProtector = require('./middlewares/apiKeyProtector')

const routes = require('./routes')

const app = express()

// app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(apiKeyProtector, routes)
app.get('/ping', (req, res) => res.json({ ping: 'pong' }))

module.exports = app
