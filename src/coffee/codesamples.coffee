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
    runnable  : options.runnable ? no
    title     : options.title
    showTitle : options.showTitle ? yes

  getDepsData = (deps) ->
    if deps.length
    then "data-deps=\"#{ deps.join ' ' }\" "
    else ''

  wrapCodeSample = (deps, demo, codeSample, options = {}) ->
    options = getDefaultOptions options
    [ ..., ext ] = demo.split '.'
    """
    #{
      if options.showTitle
      then "<h4>#{ options.title ? demo }</h4>"
      else ""
    }
    <pre id="#{ demo }" #{ getDepsData deps }class="sample language-#{ ext }#{
      if options.runnable
      then ' runnable'
      else ''
    }">
    <code>#{ codeSample.replace /\n$/, '' }</code>
    </pre>
    """

  injectCodeSamples = (file, encoding, next) ->
    text = file.contents.toString encoding

    fileContents.then (contents) =>
      file.contents = new Buffer \
        # inject the lodash template
        template text,
        # method(s) exposed to the template:
        codeSample: (demo, deps, options) ->
          [ options, deps ] = [deps, options]  unless options?
          deps ?= []
          wrapCodeSample deps, demo, contents[demo], options

      @push file
      next()

  fileContents = do (memo = {}) ->
    (memoizeContents memo, ['js', 'go', 'bash', 'json']).then -> memo

  through.obj injectCodeSamples
