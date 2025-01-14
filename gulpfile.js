'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csso = require ('gulp-csso');
var rename = require ('gulp-rename');
var svgstore = require ('gulp-svgstore');
var imagemin = require ('gulp-imagemin');
var webp = require ('gulp-webp');
var server = require ('browser-sync').create();
var del = require ('del');
var htmlmin = require ('gulp-htmlmin');

var scripts = {
  output:'./build/js',
  input:[
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/svg4everybody/dist/svg4everybody.js',
    './js/*.js'
  ]
};

var styles = {
  output:'./build/css',
  input: [
    './node_modules/normalize.css/normalize.css',
    './scss/main.scss'
  ],
  watch: [
    './scss/**/*.scss'
  ]
};

gulp.task('css', function(){
  return gulp.src(styles.input)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(styles.output))
    .pipe(gulp.dest('./build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(server.stream());
});

// gulp.task('csso', function () {
//   return gulp.src('./build/css/style.css')
//     .pipe(csso())
//     .pipe(rename('style.min.css'))
//     .pipe(gulp.dest('./build/css'));
// });

gulp.task('js', function(){
  return gulp.src(scripts.input)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(scripts.output));
});

gulp.task('watch', function () {
  gulp.watch(styles.watch, gulp.parallel ('css'));
  //gulp.watch(scripts, ['js']);
});

gulp.task('default', gulp.parallel('css','js','watch'));



gulp.task('imagemin', function () {
  return gulp.src('./img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))

    .pipe(gulp.dest('./img'));
});

gulp.task('webp', function () {
  return gulp.src('./img/**/*.{png,jpg}')
    .pipe(webp({quality: 75}))
    .pipe(gulp.dest('./img'));
});

gulp.task('sprite', function () {
  return gulp.src('./img/*.svg')
    .pipe(svgstore(
      {inlineSvg: true
      }))
    .pipe(rename('sprite-automatic.svg'))
    .pipe(gulp.dest('./img'));
});

gulp.task('posthtml', function () {
  return gulp.src('./*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('./'));
});

gulp.task('server', function () {
  server.init({
    server: "D:/site/mishka"
  });

  gulp.watch(styles.watch, gulp.series('css'));
  gulp.watch('*.html')
    .on('change', server.reload);

});

gulp.task('copy', function () {
  return gulp.src ([
    'fonts/**/*.{woff,woff2}',
    'img/**',
    // 'js/**'
  ], {
    base: './'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('html', function(){
  return gulp.src([
    './*.html'
  ])
    .pipe(rename({
      suffix: "-min",
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'))
});
