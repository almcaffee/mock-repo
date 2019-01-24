// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    browserNoActivityTimeout: 20000,
    browserConsoleLogOptions: {
      level:  'error',
      terminal: true
    },
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-spec-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: false
    },
    crossOriginAttribute: true,
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      dir: '/reports/coverage',
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 75, // Our test coverage goal 75%
        lines: 75,
        branches: 75,
        functions: 75
      }
    },
    reporters: ['progress', 'spec', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    files: [
      { pattern: './assets/images/*.png', served: true, watched: false },
      './assets/css/theme.css',
      './assets/css/reset.css',
      './assets/css/layout.css',
      './assets/css/landing.css',
      './assets/css/mat-overrides.css',
      './assets/css/forms.css',
      './assets/css/print.css'
    ]
  });
};
