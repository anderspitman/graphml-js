var gulp = require("gulp");
var ts = require("gulp-typescript");
var mocha = require("gulp-mocha");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");

var tsOptions = {
  noImplicitAny: true,
  target: 'es5'
};


var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/parser.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("compile-src", function() {
    return gulp.src('src/*.ts')
        .pipe(ts(tsOptions))
        .pipe(gulp.dest('src'));
});

gulp.task("compile-tests", function() {
    return gulp.src('test/test*.ts')
        .pipe(ts(tsOptions))
        .pipe(gulp.dest('test'));
});

gulp.task("test", ["compile-src", "compile-tests"], function() {
    return gulp.src(['test/test*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task("autotest", function() {
    return gulp.watch(['src/*.ts', 'test/*.ts'], ['test']);
});

gulp.task("default", bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
