'use strict';

// requirements

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean');


// tasks

gulp.task('transform', function () {
  // add task
});

gulp.task('default', ['clean'], function () {
  console.log("Hello QBer!");
  gulp.start('transform');
  gulp.watch('./app/static/jsx/qber.jsx', ['transform']);
});




gulp.task('transform', function () {
  return gulp.src('./app/static/jsx/qber.jsx')
    .pipe(browserify({transform: ['reactify']}))
    .pipe(rename('qber.js'))
    .pipe(gulp.dest('./app/static/js'))
    .pipe(size());
});


gulp.task('clean', function () {
  return gulp.src(['./app/static/js'], {read: false})
    .pipe(clean());
});
