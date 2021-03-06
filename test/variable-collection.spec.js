'use strict';

var _ = require('underscore');
var expect = require('chai').expect;
var VariableCollection = require('../app/scripts/models/variable-collection');
var Variable = require('../app/scripts/models/variable');

describe('variable collection', function () {

  it('should initialize with list of variables', function () {
    var variables = new VariableCollection({
      items: [{name: 'u'}, {name: 'v'}]
    });
    expect(variables).to.have.property('items');
    expect(variables.items).to.have.length(2);
    variables.items.forEach(function (variable) {
      expect(variable).to.be.an.instanceof(Variable);
    });
  });

  it('should map variable permutations', function () {
    var expectedPermutations = [
      {s: false, t: false},
      {s: false, t: true},
      {s: true, t: false},
      {s: true, t: true}
    ];
    var variables = new VariableCollection({
      items: [{name: 's'}, {name: 't'}]
    });
    var actualPermutations = variables.mapPermutations(function (varValues) {
      return _.extend({}, varValues);
    });
    expect(actualPermutations[0]).to.deep.equal(expectedPermutations[0]);
    expect(actualPermutations[1]).to.deep.equal(expectedPermutations[1]);
    expect(actualPermutations[2]).to.deep.equal(expectedPermutations[2]);
    expect(actualPermutations[3]).to.deep.equal(expectedPermutations[3]);
  });

  describe('getNextVariableName', function () {

    var variables = new VariableCollection({
      items: [{name: 'q'}, {name: 's'}, {name: 'z'}, {name: 'a'}]
    });

    it('should find names in-between existing variables', function () {
      expect(variables.getNextVariableName(variables.items[0])).to.equal('r');
    });
    it('should find next available name without wrapping', function () {
      expect(variables.getNextVariableName(variables.items[1])).to.equal('t');
    });
    it('should wrap around to next available name as needed', function () {
      expect(variables.getNextVariableName(variables.items[2])).to.equal('b');
    });

  });

});
