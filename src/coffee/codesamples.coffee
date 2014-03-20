
Promise = require 'bluebird'
through = require 'through2'
{ join: joinPath } = require 'path'
template = require 'lodash.template'
util = require 'util'

fs = Promise.promisifyAll require 'fs'

module.exports = (path) ->

  rootPath = joinPath process.cwd(), path

  getContents = (fullPath) ->
    fs.readFileAsync fullPath, 'utf-8'
      .then (contents) ->
        [ ..., file ] = fullPath.split '/'
        [file, contents]

  memoizeDirContents = (dir, memo) ->
    folder = joinPath rootPath, dir
    fs.readdirAsync folder
      .map (file) ->
        fullPath = joinPath folder, file
        getContents fullPath
      .reduce (memo, [ file, contents ]) ->
        memo[file] = contents
        memo
      , memo

  memoizeContents = (memo, dirs) ->
    Promise.all dirs.map (dir) -> memoizeDirContents dir, memo

  getDefaultOptions = (options) ->
    showTitle: options.showTitle ? yes

  wrapCodeSample = (title, codeSample, options = {}) ->
    options = getDefaultOptions options
    [ ..., ext ] = title.split '.'
    """
    #{
      if options.showTitle
      then "<h4>#{ title }</h4>"
      else ""
    }
    <pre class="sample language-#{ ext }"><code>#{
      codeSample
    }</code></pre>
    """

  injectCodeSamples = (file, encoding, next) ->
    text = file.contents.toString encoding

    fileContents.then (contents) =>

      file.contents = new Buffer(
        # inject the lodash template
        template text,
        # methods exposed to the template
        codeSample: (demo, options) ->
          wrapCodeSample demo, contents[demo], options
      )
      @push file
      next()

  fileContents = do (memo = {}) ->
    memoizeContents(memo, ['js', 'coffee', 'bash', 'json']).then -> memo

  through.obj(injectCodeSamples)
