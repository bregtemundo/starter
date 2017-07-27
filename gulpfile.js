/*
STYLES:
modular font grid(typesettings/ sass line / typi / plumber-sass / ritmo),
todo: 2 options , typi or megatype whan design is on baseline grid or not, 
then import different typography.scss

IMAGES:
minify , squeze those pngs, svg sprites?

 */
 
 const gulp = require('gulp');
 const babelify = require('babelify');
 const browserify = require('browserify');
 const watchify = require('watchify');
 const glob = require('glob');
 const sassGlob = require('gulp-sass-glob');
 const source = require('vinyl-source-stream');
 const buffer = require('vinyl-buffer');
 const babel = require('babel-core/register');
 const plugins = require('gulp-load-plugins')();
 const browserSync = require('browser-sync');
 const beep = require('beepbeep');


 const config = require('./gulp-config.json');

// Compile Sass to css, prefix css variables when needed
gulp.task('sass', function() {
  gulp.src(config.css.src + '/**/*.scss')
    .pipe(plugins.plumber({errorHandler: handleErrors}))
    .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.init()) )
    .pipe(sassGlob())
    .pipe(plugins.sass({
      includePaths: config.css.paths
    }))      
    .pipe(plugins.autoprefixer({
      browsers: config.css.support,
      cascade: false
    }))
    .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write('/maps')) )
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(config.css.dest));
});

// Bundle and babelify js files
gulp.task("browserify", function () {
  var props = {
    entries: glob.sync(config.js.src + '/*.js'),
    debug: true,
    paths: config.js.paths,
    transform: [
      ["babelify", { 
        "presets": ["es2015"], 
        "plugins": "transform-class-properties",
        "sourceMaps": config.sourcemaps
      }]
    ]
  };

  browserify(props).bundle() 
    .on('error', handleErrors)
    .pipe(plugins.plumber({errorHandler: handleErrors}))     
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.init({loadMaps: true})) )
    .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write('/maps')) )
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(config.js.dest));  

});

// get files ready for production
gulp.task('minify', function() {
  // minify css
  gulp.src(config.css.dest + '/**/*.css')    
    .pipe(plugins.cleanCss())    
    .pipe(gulp.dest(config.css.dest));
  
  // minify js
  gulp.src(config.js.dest + '/**/*.js')
    .pipe(plugins.uglify())
    //.pipe(plugins.rename({ extname: '.min.js' }))
    .pipe(gulp.dest(config.js.dest));
      
});

// start server and watch for filechanges
gulp.task('watch', function() {
  // start up browsersync server
  browserSync({
    proxy: config.server,         
    //'server': './',  
    files: [config.css.dest + "/**/*.css", config.js.dest + "/**/*.js", "./**/*.{php,info}"]
  });

  // watch sass updates
  gulp.watch(config.css.src + '/**/*.scss', ['sass']);

  // watch js updates
  gulp.watch(config.js.src + '/**/*.js', ['browserify']);
   
});

// force set variables for production
gulp.task('production', function() {
  config.sourcemaps = false;
});


function handleErrors(err) {
  if(!err.plugin) {
    err.plugin = "Browserify";
    err.Error = err.syntaxError;
  }
  plugins.notify.onError({
    title:    "Gulp error in " + err.plugin,
    message:  err.Error
  })(err);

  beep();

  console.log(err.toString());
 
  this.emit('end');
}




// combined tasks
gulp.task('build', plugins.sequence('production', 'sass', 'browserify', 'minify'));
gulp.task('start', plugins.sequence('watch'));
gulp.task('default', plugins.sequence('build'));