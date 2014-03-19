
Promise = require 'bluebird'
through = require 'through2'
path = require 'path'
template = require 'lodash.template'
util = require 'util'

fs = Promise.promisifyAll require 'fs'

module.exports = (rootPath) ->

  getContents = (fullPath) ->
    fs.readFileAsync fullPath, 'utf-8'
      .then (contents) ->
        [ ..., file ] = fullPath.split '/'
        [file, contents]

  getFiles = (dir, memo) ->
    fs.readdirAsync path.join rootPath, dir
      .map (file) ->
        fullPath = path.join rootPath, dir, file
        getContents fullPath
      .reduce (memo, [ file, contents ]) ->
        memo[file] = contents
      , memo

  wrapCodeSample = (codeSample) ->
    """
    
    <pre><code>#{ codeSample }</code></pre>
    """

  injectCodeSamples = (file, encoding, next) ->
    return next PluginError 'Streaming not supported'  if file.isStream()

    text = file.contents.toString encoding

    fileContents.then (contents) =>
      file.contents = new Buffer(
        template text, codeSample: (demo) -> wrapCodeSample contents[demo]
      )
      @push file
      next()

  memoizeContents = (memo, dirs) ->
    Promise.all dirs.map (dir) -> getFiles dir, memo

  fileContents = do (memo = {}) ->
    memoizeContents(memo, ['js', 'coffee', 'sh', 'json']).then -> memo

  through.obj(injectCodeSamples)
