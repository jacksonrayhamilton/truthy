/* eslint-env node */

'use strict';

var path = require('path');
var sourceMappedCoverage = require('./source-mapped-coverage');

var basePathDir = 'public';
var fullBasePath = path.join(__dirname, basePathDir);

module.exports = function (config) {
  config.set({
    basePath: basePathDir,
    browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome'],
    files: ['scripts/modules.js', 'scripts/test.js'],
    reporters: ['dots'].concat(process.env.COVERAGE ? ['coverage'] : []),
    frameworks: ['mocha'],
    middleware: ['static'],
    preprocessors: {
      '**/*.js': ['sourcemap'],
      'scripts/modules.js': process.env.COVERAGE ? ['coverage'] : []
    },
    coverageReporter: sourceMappedCoverage(fullBasePath, {
      type: 'html',
      dir: '../coverage/'
    }),
    static: {
      path: path.join(__dirname, 'public')
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  });
};
