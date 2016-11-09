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
    group = require('gulp-group-files')
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
// gulp.task('miniHtml', function () {
//     return gulp.src(['src/rev/**/*.json', 'src/*.html'])
//         .pipe(revCollector())
//         .pipe(gulpif(
//             condition, minifyHtml({
//                 empty: true,
//                 spare: true,
//                 quotes: true
//             })
//         ))
//         .pipe(gulp.dest('dist'));
// });
gulp.task('delRevCss', function(){
    del([cssRevSrc, cssRevSrc.replace('src/', 'dist/')]);    
})

//开发构建
//1.任务从左到右执行. 2.若要并行执行，则用[]包括
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        'html:clean','css:clean','sass:compile',
        'js:clean','js:compile-sub','js:compile-main',
        'html:mini',
        'rev:html','rev:js',
         //['revFont', 'revImg'],
         //['lintJs'],
         //['revCollectorCss'],
         //['miniCss', 'miniJs'],
         //['miniHtml', 'delRevCss'],
    done);
});
//正式构建
gulp.task('build', function (done) {
    runSequence(
        'html:clean','css:clean','sass:compile',
        'js:clean','js:compile-sub','js:compile-main',
        'html:mini',
        'rev:html','rev:js',
         //['revFont', 'revImg'],
         //['lintJs'],
         //['revCollectorCss'],
         //['miniCss', 'miniJs'],
         //['miniHtml', 'delRevCss'],
    done);
});

// 压缩文件与未压缩文件名一样，便于替换
gulp.task('sass:compile', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssimport())
        .pipe(concat('main.css'))
        .pipe(gulpif(
            condition, minifycss({
                processImport: true,
                compatibility: 'ie7'
            })
        ))
        .pipe(gulpif(condition, rev()))                                                  //文件名加MD5后缀
        .pipe(gulp.dest('dist/css'))
        .pipe(gulpif(condition, rev.manifest({path:'rev-css.json'})))                           //生成一个rev-manifest.json
        .pipe(gulpif(condition, gulp.dest('./rev')))                //将 rev-manifest.json 保存到 rev 目录内
        .pipe(connect.reload());
});

//编译每个非js根目录js文件，便于懒加载.
gulp.task('js:compile-sub', function() {
    return gulp.src(['src/js/**/*.js','!src/js/*.js'])
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))
        .pipe(gulpif(condition, uglify()))
        .pipe(gulpif(condition, rev()))
        .pipe(gulp.dest('dist/js'))
        .pipe(gulpif(condition, rev.manifest({path:'rev-js-sub.json'})))                            //生成一个rev-manifest.json
        .pipe(gulpif(condition, gulp.dest('./rev')));
});

//将js根目录下所有js文件合并为main.js.
gulp.task('js:compile-main', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulpif(condition, uglify()))
        .pipe(gulpif(condition, rev()))
        .pipe(gulp.dest('dist/js'))
        .pipe(gulpif(condition, rev.manifest({path:'rev-js-main.json'})))
        .pipe(gulpif(condition, gulp.dest('./rev')));
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
gulp.task('html:clean', function() {
    return gulp.src(['dist/**/*.html','./rev/*.json'])
        .pipe(clean());
});

gulp.task('connect', function () {
    connect.server({
        root: './dist/',
        port: 8888,
        host: '127.0.0.1',
        livereload: true
    });
});

gulp.task('html:mini', function () {
  gulp.src('./src/html/**/*.html')
    .pipe(gulpif(
            condition, minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            })
        ))
    .pipe(gulp.dest('./dist/html'));
});

gulp.task('rev:html', function() {
    gulp.src(['./rev/*.json', './src/index.html'])                  //- 读取 rev-manifest.json并更新引用文件名
        .pipe(gulpif(condition, revCollector()))                    //- 执行文件内css名的替换
        .pipe(gulp.dest('./dist/'));                                //- 替换后的文件输出的目录
});

gulp.task('rev:js', function() {
    gulp.src(['./rev/*.json', './dist/js/main-*.js'])
        .pipe(gulpif(condition, revCollector()))
        .pipe(gulp.dest('./dist/js/'));
});
 
gulp.task('watch', function () {
  //gulp.watch('public/javascripts/**/*.js', ['sass:compile']);
  gulp.watch(['src/sass/**/*.scss','src/sass/**/*.css'], ['sass:compile']);
  gulp.watch(['./src/*.html'], ['html']);
});
gulp.task('default',['connect']);

