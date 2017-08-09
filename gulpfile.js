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
 const svgSprite = require("gulp-svg-sprites");
 const iconfont = require('gulp-iconfont');
 const iconfontCss = require('gulp-iconfont-css');


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
    .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write('/maps', {includeContent: false, sourceRoot: '/'})) )
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(config.js.dest));  

});

// create an svg spritesheet from svg files
gulp.task('sprite', function () {
    return gulp.src(config.sprite.src + '/*.svg', {base: './'})
      .pipe(svgSprite({
        //mode: "symbols",
        templates: { scss: true },
        selector: "%f",
        svgPath: '../../' + config.sprite.dest + '/%f',
        cssFile: '../../../' + config.css.src + '/base/_sprite.scss',
        preview: false,
        common: 'sprite',
        svg: {
          sprite: 'sprite.svg'
        }
      }))
      .pipe(gulp.dest(config.sprite.dest));
});

// create an iconfont and scss from svg files
gulp.task('icons', function(){
  fontName = "icons"
  gulp.src([config.icons.src + '/*.svg'], {base: './'})
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'scss',
      targetPath: '../../../' + config.css.src + '/base/_icons.scss',
      fontPath: '../../' + config.icons.dest + '/'
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001
     }))
    .pipe(gulp.dest(config.icons.dest));
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

  // watch icons updates
  gulp.watch(config.icons.src + '/**/*.svg', ['icons']);

  // watch sprite updates
  gulp.watch(config.sprite.src + '/**/*.svg', ['sprite']);
   
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