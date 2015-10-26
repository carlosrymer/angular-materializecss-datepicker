var argv              = require('minimist')(process.argv.slice(2)),
		gulp              = require('gulp'),
		gulpConcat        = require('gulp-concat'),
		gulpTemplateCache = require('gulp-angular-templatecache'),
		gulpJsHint        = require('gulp-jshint'),
		gulpUglify        = require('gulp-uglify'),
		karma             = require('karma'),
		KarmaServer       = karma.Server;

function build() {
	return gulp.src(['angular-materializecss-datepicker.js', 'template.js'])
		.pipe(gulpConcat('angular-materializecss-datepicker.min.js'))
		.pipe(gulpUglify({
			mangle : false
		}))
		.pipe(gulp.dest('.'));
}

function jshint() {
	return gulp.src(['angular-materializecss-datepicker.js', 'tests.spec.js'])
		.pipe(gulpJsHint());
}

function template() {
	return gulp.src('angular-materializecss-datepicker.tpl.html')
		.pipe(gulpTemplateCache({
			filename   : 'template.js',
			module     : 'angularMaterializeDatePickerTemplate',
			standalone : true
		}))
		.pipe(gulp.dest('.'));
}

function test(done) {
	return new KarmaServer({
    configFile : __dirname + '/karma.conf.js',
    singleRun  : argv.singleRun === 'true'
  }, done).start();
}

gulp.task('default', ['jshint', 'template'], build);
gulp.task('build', ['jshint', 'template'], build);
gulp.task('jshint', jshint);
gulp.task('template', template);
gulp.task('test', ['jshint'], test);

module.exports = gulp;