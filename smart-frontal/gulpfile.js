'use strict';
// 载入外挂
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
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

gulp.task('sass:compile', function() {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssimport())
        .pipe(concat('main.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({
            processImport: true
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// 脚本
gulp.task('scripts', function() {
    return gulp.src('js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// 图片
gulp.task('images', function() {
    return gulp.src('public/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('public/dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/css'], {read: false})
        .pipe(clean());
});

// 预设任务
gulp.task('default',['sass:compile', 'scripts', 'images']);

// 看手
gulp.task('watch', function() {

    // 看守所有.scss档
    gulp.watch('public/stylesheets/**/*.scss', ['sass:compile']);

    // 看守所有.js档
    gulp.watch('public/javascripts/**/*.js', ['sass:compile']);

    // 看守所有图片档
    gulp.watch('public/images/**/*', ['images']);

    // 建立即时重整伺服器
    var server = livereload();

    // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['public/dist/**']).on('change', function(file) {
        server.changed(file.path);
    });

});