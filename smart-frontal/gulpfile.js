'use strict';

/**
 * 
 * build html,js,css,font,image to dist and dev dir, they all have md5 suffix.
 * dist dir: for release.
 * dev dir: for developer.
 * 处理后两个目录中文件名相同(not .min)，便于html替换。
 */

// 载入外挂
var gulp = require('gulp'),
    del = require('del'),
    connect = require('gulp-connect'),
    runSequence = require('run-sequence'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    changed = require('gulp-changed'),
    stylish = require('jshint-stylish'),                             //高亮
    autoprefixer = require('gulp-autoprefixer'),
    minifyHtml = require('gulp-minify-html'),                        //html压缩
    minifycss = require('gulp-clean-css'),
    cssimport = require("gulp-cssimport"),
    csslint = require('gulp-csslint'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    rev = require('gulp-rev'),                                        //加MD5后缀
    revCollector = require('gulp-rev-collector'),                     //路径替换
    livereload = require('gulp-livereload'),
    group = require('gulp-group-files'),
    ;

var cssSrc = ['main.scss'],
    cssDest = 'dist/css',
    jsSrc = 'dev/js/*.js',
    jsDest = 'dist/js',
    fontSrc = 'dev/fonts/*',
    fontDest = 'dist/font',
    imgSrc = 'dev/img/*',
    imgDest = 'dist/img',
    cssRevSrc = 'dev/css/revCss',
    condition = true;

function changePath(basePath){
    var nowCssSrc = [];
    for (var i = 0; i < cssSrc.length; i++) {
        nowCssSrc.push(basePath + '/' + cssSrc[i]);
    }
    return nowCssSrc;
}

//Fonts & Images 根据MD5获取版本号
gulp.task('revFont', function(){
    return gulp.src(fontSrc)
        .pipe(rev())
        .pipe(gulp.dest(fontDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/font'));
});
gulp.task('revImg', function(){
    return gulp.src(imgSrc)
        .pipe(rev())
        .pipe(gulp.dest(imgDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/img'));
});

//检测JS
gulp.task('lintJs', function(){
    return gulp.src(jsSrc)
        //.pipe(jscs())   //检测JS风格
        .pipe(jshint({
            "undef": false,
            "unused": false
        }))
        //.pipe(jshint.reporter('default'))  //错误默认提示
        .pipe(jshint.reporter(stylish))   //高亮提示
        .pipe(jshint.reporter('fail'));
});

//压缩JS/生成版本号
gulp.task('miniJs', function(){
    return gulp.src(jsSrc)
        .pipe(gulpif(
            condition, uglify()
        ))
        .pipe(rev())
        .pipe(gulp.dest(jsDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/js'));
});

//CSS里更新引入文件版本号
gulp.task('revCollectorCss', function () {
    return gulp.src(['src/rev/**/*.json', 'src/css/*.scss'])
        .pipe(revCollector())
        .pipe(gulp.dest(cssRevSrc));
});

//检测CSS
gulp.task('lintCss', function(){
    return gulp.src(cssSrc)
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(csslint.failReporter());
});
//压缩/合并CSS/生成版本号
gulp.task('miniCss', function(){
    return gulp.src(changePath(cssRevSrc))
        .pipe(less())
        .pipe(gulpif(
            condition, minifyCss({
                compatibility: 'ie7'
            })
        ))
        .pipe(rev())
        .pipe(gulpif(
            condition, changed(cssDest)
        ))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false
        }))
        .pipe(gulp.dest(cssDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/css'));
});
//压缩Html/更新引入文件版本
gulp.task('miniHtml', function () {
    return gulp.src(['src/rev/**/*.json', 'src/*.html'])
        .pipe(revCollector())
        .pipe(gulpif(
            condition, minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            })
        ))
        .pipe(gulp.dest('dist'));
});
gulp.task('delRevCss', function(){
    del([cssRevSrc, cssRevSrc.replace('src/', 'dist/')]);    
})


//开发构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
         ['revFont', 'revImg'],
         ['lintJs'],
         ['revCollectorCss'],
         ['miniCss', 'miniJs'],
         ['miniHtml', 'delRevCss'],
    done);
});
//正式构建
gulp.task('build', function (done) {
    runSequence(
         ['revFont', 'revImg'],
         ['lintJs'],
         ['revCollectorCss'],
         ['miniCss', 'miniJs'],
         ['miniHtml', 'delRevCss'],
    done);
});

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
        //.pipe(notify({ message: 'Styles task complete' }))
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
        .pipe(gulp.dest('dist/js'))
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

