gulp    = require 'gulp'
stylus  = require 'gulp-stylus'
coffee  = require 'gulp-coffee'

gulp.task 'build style', ->
  gulp.src 'src/stylus/main.styl'
    .pipe stylus()
    .pipe gulp.dest '.'

gulp.task 'build script', ->
  gulp.src 'src/coffee/main.coffee'
    .pipe coffee()
    .pipe gulp.dest '.'

gulp.task 'default', ['build style', 'build script']
