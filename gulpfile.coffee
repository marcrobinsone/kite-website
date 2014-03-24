gulp    = require 'gulp'
stylus  = require 'gulp-stylus'
coffee  = require 'gulp-coffee'
rename  = require 'gulp-rename'
path    = require 'path'

injectCodeSamples = require './src/coffee/codesamples.coffee'

gulp.task 'build style', ->
  gulp.src 'src/stylus/main.styl'
    .pipe stylus()
    .pipe rename 'main.css'
    .pipe gulp.dest 'css'

gulp.task 'build script', ->
  gulp.src 'src/coffee/main.coffee'
    .pipe coffee()
    .pipe gulp.dest '.'

gulp.task 'build html', ->
  gulp.src 'documentation/index.ejs.html'
    .pipe injectCodeSamples 'documentation'
    .pipe rename 'index.html'
    .pipe gulp.dest '.'

gulp.task 'default', ['build style', 'build script', 'build html']
