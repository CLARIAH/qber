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
  gulp.watch(['./js/qber.js','./js/**/*.js'], ['transform']);
});




gulp.task('transform', function () {
  return gulp.src('./js/qber.js')
    .pipe(browserify({transform: ['reactify']}))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(size());
});


gulp.task('clean', function () {
  return gulp.src(['./dist/js'], {read: false})
    .pipe(clean());
});
