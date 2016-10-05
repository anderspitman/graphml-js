var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var del = require('del');

var tsOptions = {
  noImplicitAny: true,
  target: 'es5',
  module: 'commonjs'
};

gulp.task("default", ["compile-src"], build);

gulp.task("compile-src", compile);

function compile() {
    return gulp.src('src/*.ts')
        .pipe(ts(tsOptions))
        .pipe(gulp.dest('src'));
}

function build() {
    return gulp.src('src/parser.js')
        .pipe(rename('graphml.js'))
        .pipe(gulp.dest('dist'));
}

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

gulp.task("clean", function() {
    return del([
        'dist/*',
        'src/*.js',
        'test/*.js'
    ]);
});
