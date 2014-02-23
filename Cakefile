# option '-o', '--output [DIR]', 'directory for compiled code'


stylusPath = __dirname  + '/src/stylus'
stylusFile = stylusPath + '/main.styl'
coffeePath = __dirname  + '/src/coffee'
coffeeFile = coffeePath + '/main.coffee'
cssPath    = './css/jumbotron.css'
jsPath     = './js/main.js'
includes   = require "#{__dirname}/includes.coffee"
fs         = require 'fs'
Stylus     = require 'stylus'
Coffee     = require 'coffee-script'
Watch      = require 'watch'
timeIt     = ->
  a = (v)->
    if "#{v}".length is 1 then "0#{v}" else v
  date = new Date
  return "#{a date.getHours()}:#{a date.getMinutes()}:#{a date.getSeconds()}"

task 'build', "compile css and coffee files", ->

  styles = fs.readFileSync stylusFile, "utf-8"
  Stylus(styles)
    .set('compress',true)
    .set('paths', [ stylusPath ])
    .render (err, css) -> # callback is synchronous
      console.error "error with styl file:\n #{err}"  if err
      fs.writeFileSync cssPath, css, "utf8"

  source = ''
  for file in includes
    source += fs.readFileSync "#{__dirname}/#{file}", "utf-8"
    source += '\n\n'

  fs.writeFileSync jsPath, Coffee.compile source, "utf8"

  console.log "build finished."




task 'watch', 'watch stylus and coffee files', ->

  Watch.watchTree stylusPath, (f, curr, prev)->

    if typeof f is "object" and not prev and not curr
      console.log 'Finished walking the tree at', timeIt()
    else if not prev
      console.log f, 'is created at', timeIt()
      invoke 'build'
    else if curr.nlink is 0
      console.log f, 'was removed at', timeIt()
      invoke 'build'
    else
      console.log f, 'was changed at', timeIt()
      invoke 'build'

  Watch.watchTree coffeePath, (f, curr, prev)->

    if typeof f is "object" and not prev and not curr
      console.log 'Finished walking the tree at', timeIt()
    else if not prev
      console.log f, 'is created at', timeIt()
      invoke 'build'
    else if curr.nlink is 0
      console.log f, 'was removed at', timeIt()
      invoke 'build'
    else
      console.log f, 'was changed at', timeIt()
      invoke 'build'

do ->
  invoke 'watch'

  http = require 'http'

  host = "127.0.0.1"
  port = 1337
  express = require "express"

  app = express()
  app.use app.router
  app.use express.static __dirname

  app.listen(port, host);