'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var flatten = require('gulp-flatten');
var del = require('del');

// Clean up development output
gulp.task('clean', function(cb) {
    del([
        './.tmp'
    ], cb);
});

// Static Server + watching scss/html files
gulp.task('serve', ['flatten', 'sass', 'fileinclude'], function() {

    browserSync.init({
        server: "./.tmp"
    });

    gulp.watch("./dev/scss/**/*.scss", ['sass']);
    gulp.watch("./dev/**/*.html", ['fileinclude']);
    gulp.watch("./dev/vendor/**", ['flatten']);

    gulp.watch("./dev/js/**/*.js").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./dev/scss/*.scss")
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(gulp.dest("./.tmp/css"))
        .pipe(browserSync.stream());
});

// Compile HTML file includes
gulp.task('fileinclude', function() {
    gulp.src(['./dev/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./.tmp'));
});

// Flatten vendor folder
gulp.task('flatten', function() {
    gulp.src(['./dev/vendor/**/*.min.js', './dev/vendor/**/*.min.css'])
        .pipe(flatten())
        .pipe(gulp.dest('.tmp/vendor'));
});

// Inject assets into html
// gulp.task('inject', ['sass','fileinclude'], function(cb) {
//     var target = gulp.src('./.tmp/**/*.html');
//     // It's not necessary to read the files (will speed up things), we're only after their paths:
//     var sources = gulp.src(['./.tmp/js/**/*.js', './.tmp/css/**/*.css'], {
//         read: false
//     });

//     return target.pipe(inject(sources, {relative: true}))
//         .pipe(gulp.dest('./.tmp'));

//     cb(err);
// });

gulp.task('default', ['serve']);
