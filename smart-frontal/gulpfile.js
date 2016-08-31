'use strict';
// 载入外挂
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    //autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    cssimport = require("gulp-cssimport"),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    group = require('gulp-group-files'),
    less = require('gulp-less');

var sassFiles = {
    "xxx" : {
        src: "./xxx/styles/sass/index.scss",
        dest: "./xxx/styles/"
    },
    "yyy" : {
        src: "./yyy/styles/sass/index.scss",
        dest: "./yyy/styles/"
    }
};

gulp.task('sass:compile2',function (){
    return group(sassFiles,function (key,fileset){
        return gulp.src(fileset.src)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(fileset.dest));
    })();
});

gulp.task('sass:watch',function (){
    gulp.watch('**/*.scss',['sass:compile'])
});

gulp.task('bootstrap', function() {
    return gulp.src('public/javascripts/lib/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('public/javascripts/lib/bootstrap/dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({
            processImport: true
        }))
        .pipe(gulp.dest('public/javascripts/lib/bootstrap/dist/css'))
        .pipe(notify({ message: 'bootstrap task complete' }));
});

gulp.task('sass:compile', ['css:clean'], function() {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssimport())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({
            processImport: true
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }))
        .pipe(connect.reload());
});

//编译每个非js根目录js文件，便于懒加载.
gulp.task('js:compile', ['js:compile-main'], function() {
    return gulp.src(['js/**/*.js','!js/*.js'])
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))
        //.pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//将js根目录下所有js文件合并为main.js.
gulp.task('js:compile-main', ['js:clean'], function() {
    return gulp.src('js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function() {
    return gulp.src('public/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('public/dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('css:clean', function() {
    return gulp.src(['dist/css'], {read: false})
        .pipe(clean());
});
gulp.task('js:clean', function() {
    return gulp.src(['dist/js'], {read: false})
        .pipe(clean());
});


gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 8888,
        host: '127.0.0.1',
        livereload: true
    });
});

gulp.task('js', function () {
    gulp.src('./**/*.js')
        .pipe(connect.reload());
});
gulp.task('html', function () {
  gulp.src('./**/*.html')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  //gulp.watch('public/javascripts/**/*.js', ['sass:compile']);
  gulp.watch(['sass/**/*.scss','sass/**/*.css'], ['sass:compile']);
  gulp.watch(['./*.html'], ['html']);
});
gulp.task('default',['connect', 'watch']);

