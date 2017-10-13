var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var del = require('del');
var merge = require('merge-stream');

var tsOptions = {
  noImplicitAny: true,
  declaration: true,
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
    var main = gulp.src('src/parser.js')
        .pipe(rename('graphml.js'))
        .pipe(gulp.dest('dist'));
    var typings = gulp.src('src/parser.d.ts')
        .pipe(rename('index.d.ts'))
        .pipe(gulp.dest('dist'));
    return merge(main, typings);
}

function typings() {
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
