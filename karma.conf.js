'use strict';

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		logLevel: config.LOG_INFO,
		browsers: ['PhantomJS'],
		autoWatch: true,
		reporters: ['dots', 'coverage'],
		files: [
			'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
			'angular-materializecss-datepicker.js',
      'angular-materializecss-datepicker-template.js',
			'tests.spec.js'
		],
		preprocessors: {
			'angular-materializecss-datepicker.js': 'coverage'
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		}
	});
};