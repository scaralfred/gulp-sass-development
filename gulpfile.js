var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss')
var babel = require('gulp-babel');
var del = require('del');
var zip = require('gulp-zip');

// Images tools for compression
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

// Handlebars Plugin
const handlebars = require('gulp-handlebars');
const handlebarsLib = require('handlebars');
const declare = require('gulp-declare');
const wrap = require('gulp-wrap');

// Files paths
var HTML_PATH = './public/*.html';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var DIST_PATH = 'public/dist';
var SCSS_PATH = 'public/scss/**/*.scss';
var TEMPLATES_PATH = 'templates/**/*.hbs';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// Reload HTML (index.html)
gulp.task('html', function () {
    gulp.src(HTML_PATH)
        .pipe(gulp.dest('./public'))
        .pipe(livereload());
});

//// Styles (CSS)
//gulp.task('styles', function () {
//    console.log('starting styles task')
//    return gulp.src(['public/css/reset.css', CSS_PATH])
//    .pipe(plumber(function(err) {
//        console.log('Styles task error');
//        console.log(err);
//        this.emit('end')
//    }))
//    .pipe(sourcemaps.init())
//    .pipe(autoprefixer())
//    .pipe(concat('styles.css'))
//    .pipe(minifyCss())
//    .pipe(sourcemaps.write())
//    .pipe(gulp.dest(DIST_PATH))
//    .pipe(livereload())
//})

// Styles (SASS)
gulp.task('styles', function () {
   
    console.log('starting styles SCSS task')
    return gulp.src(SCSS_PATH)
    .pipe(plumber(function(err) {
        console.log('Styles task error');
        console.log(err);
        this.emit('end')
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

// Scripts
gulp.task('scripts', function () {
    console.log('Starting scripts task')
    
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function(err) {
        console.log('Scripts task error');
        console.log(err);
        this.emit('end')
    }))
        .pipe(sourcemaps.init())
        .pipe(babel({
        presets: ['es2015']
    }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload())
});


// Images 

// gulp.task('images', function () {
//     return gulp.src(IMAGES_PATH)
//     .pipe(imagemin(
//        [
//            imagemin.gifsicle(),
//            imagemin.jpegtran(),
//            imagemin.optipng(),
//            imagemin.svgo(),
//            imageminPngquant(),
//            imageminJpegRecompress()
//        ]
//     ))
//     .pipe(gulp.dest(DIST_PATH + '/images'));
// });


// Templates (Handlebars)
gulp.task('templates', function () {
    return gulp.src(TEMPLATES_PATH)
    .pipe(handlebars({
        handlebars: handlebarsLib
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
        namespace: 'templates',
        noRedaclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

// Clean task (Maybe not useful as files clean automatically)
gulp.task('clean', function () {
    return del.sync([
        DIST_PATH
    ])
})

// Default (just digit GULP into the terminal)
gulp.task('default', 
          ['clean', 
           //'images', 
           'templates', 
           'styles', 
           'scripts'], 
          function () {
    console.log('Starting default task')
});

// Gulp Zip files
gulp.task('export', function(){
    return gulp.src('public/**/*')
    .pipe(zip('website.zip'))
    .pipe(gulp.dest('./'))
})

// GULP WATCH (LIVE RELOAD)
gulp.task(
    'watch', 
     ['default'], 
    function () {
    console.log('Starting watch task');
    require('./server.js')
    livereload.listen();
//    gulp.watch(CSS_PATH, ['styles']);
    gulp.watch(SCSS_PATH, ['styles']);
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(TEMPLATES_PATH, ['templates']);
    gulp.watch(HTML_PATH, ['html']);
});

