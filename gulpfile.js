"use strict";

// requirements

var gulp = require("gulp"),
  browserify = require("gulp-browserify"),
  size = require("gulp-size"),
  rename = require("gulp-rename"),
  clean = require("gulp-clean"),
  webserver = require("gulp-webserver");

// tasks

gulp.task("transform", function() {
  // add task
});

gulp.task("webserver-dev", function() {
  gulp.src("./src").pipe(
    webserver({
      livereload: true,
      directoryListing: false,
      open: true
    })
  );
});
gulp.task("webserver", function() {
  gulp.src("./src").pipe(
    webserver({
      directoryListing: false,
      host: "0.0.0.0"
    })
  );
});

gulp.task("default", ["clean"], function() {
  console.log("Hello QBer!");
  gulp.start("transform");
  gulp.start("webserver-dev");
  gulp.watch(["./src/js/qber.js", "./src/js/**/*.js"], ["transform"]);
});

gulp.task("transform", function() {
  return gulp
    .src("./src/js/qber.js")
    .pipe(browserify({ transform: ["reactify"] }))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest("./src/dist/js"))
    .pipe(size());
});

gulp.task("clean", function() {
  return gulp.src(["./src/dist/js"], { read: false }).pipe(clean());
});
