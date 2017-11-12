/* eslint-env node */

'use strict';

var globalSourceCache = require('karma-coverage/lib/source-cache');
var remap = require('remap-istanbul/lib/remap');

// Given Karma's basePath and options for Karma's "coverage" reporter, extend
// the options to resolve source maps of the covered files before the "coverage"
// reporter writes its report.
function sourceMappedCoverage(basePath, coverageReporterOptions) {

  function onWriteReport(collector) {
    // Resolve the source maps with remap-istanbul's internal "remapper."
    var newCollector = remap(collector.getFinalCoverage());

    var coverage = newCollector.getFinalCoverage();
    Object.keys(coverage).forEach(function (file) {
      // Add the discovered source files to the source cache maintained by the
      // "coverage" reporter, which is eventually used by Istanbul's reporter.
      globalSourceCache.get(basePath)[file] = coverage[file].code;
    });

    return newCollector;
  }

  return Object.assign(coverageReporterOptions, {
    // This is a secret hook provided by the "coverage" reporter for
    // transforming the Istanbul collector before writing a report.  This hook
    // is the perfect place to resolve source maps.
    _onWriteReport: onWriteReport
  });

}

module.exports = sourceMappedCoverage;
