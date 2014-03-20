
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

  memoizeDirContents = (dir, memo) ->
    fs.readdirAsync path.join rootPath, dir
      .map (file) ->
        fullPath = path.join rootPath, dir, file
        getContents fullPath
      .reduce (memo, [ file, contents ]) ->
        memo[file] = contents
      , memo

  memoizeContents = (memo, dirs) ->
    Promise.all dirs.map (dir) -> memoizeDirContents dir, memo

  wrapCodeSample = (title, codeSample) ->
    [ ..., ext ] = title.split '.'
    """
    <h4>#{ title }</h4>
    <pre class="sample #{ ext }"><code>
    #{ codeSample }
    </code></pre>
    """

  injectCodeSamples = (file, encoding, next) ->
    text = file.contents.toString encoding

    fileContents.then (contents) =>
      methods = 
        codeSample: (demo) -> wrapCodeSample demo, contents[demo]

      file.contents = new Buffer(
        # inject the lodash template
        template text, methods
      )
      @push file
      next()

  fileContents = do (memo = {}) ->
    memoizeContents(memo, ['js', 'coffee', 'sh', 'json']).then -> memo

  through.obj(injectCodeSamples)
