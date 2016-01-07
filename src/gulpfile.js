'use strict';

// requirements

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    webserver = require('gulp-webserver');

// tasks

gulp.task('transform', function () {
  // add task
});


gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('default', ['clean'], function () {
  console.log("Hello QBer!");
  gulp.start('transform');
  gulp.start('webserver');
  gulp.watch(['./js/qber.js','./js/**/*.js'], ['transform']);
});




gulp.task('transform', function () {
  return gulp.src('./js/qber.js')
    .pipe(browserify({transform: ["reactify"]}))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(size());
});


gulp.task('clean', function () {
  return gulp.src(['./dist/js'], {read: false})
    .pipe(clean());
});
