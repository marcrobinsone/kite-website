http = require 'http'
express = require "express"

port = 1337

app = express()
app.use app.router
app.use express.static __dirname

app.listen port