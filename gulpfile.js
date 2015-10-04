// ----------------------
// REQUIRES
// ----------------------

  var gulp = require('gulp');
  var less = require('gulp-less');
  var watch = require('gulp-watch');
  var minifyCSS = require('gulp-minify-css');
  var concatCss = require('gulp-concat-css');
  var path = require('path');
  var csslint = require('gulp-csslint');

// ----------------------
// VARIABLES
// ----------------------

  var files = {
    src: {
      assets: 'src/assets/**/*.*',
      less: 'src/less/**/*.less',
      mainLess: 'src/less/main.less',
      vendor: 'src/css/vendor/*.css',
      compiledCss: 'src/css/compiled.css',
      mainCss: 'src/css/main.css',
      css: 'src/css/*.css',
      js: 'src/js/**/*.js'
    }
  };

  var paths = {
    src: {
      css: 'src/css/'
    },
    dist: {
      js: './dist/js',
      assets: './dist/assets',
      css: './dist/css/'
    }
  };

// ----------------------
// DEFAULT GULP TASK
// ----------------------

  gulp.task('default', ['minify-css'], function() {
    return gulp.watch([
        files.src.less
      ], ['default']);
  });

// ----------------------
// LESS AND CSS FUNCTIONS
// ----------------------

  // COMPILES LESS
    gulp.task('compile-less', function () {
    return gulp.src(files.src.mainLess)
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
      .pipe(gulp.dest(paths.src.css));
    });

  // LINTS CSS
    gulp.task('lint-css', ['compile-less'], function() {
      gulp.src(files.src.mainCss)
        .pipe(csslint({
            'universal-selector': false,
            'box-sizing': false // we dont support IE 6 & 7
          }))
        .pipe(csslint.reporter());
    });

  // CONCATENATE CSS
    gulp.task('concat-css', ['lint-css'], function () {
      return gulp.src([
          files.src.vendor,
          files.src.css
        ])
        .pipe(concatCss('compiled.css'))
        .pipe(gulp.dest(paths.src.css));
    });

  // MINIFIES CSS FILES
    gulp.task('minify-css', ['concat-css'], function() {
      return gulp.src(files.src.compiledCss)
        .pipe(minifyCSS({
          compatibility: 'ie8',
          keepSpecialComments : 0
         }))
        .pipe(gulp.dest(paths.dist.css))
    });