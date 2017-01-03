'use strict';

var expect = require('chai').expect;
var Expression = require('../app/scripts/expression');

describe('expression', function () {

  it('should initialize expression with unmodified input string', function () {
    var expression = new Expression({
      string: ' p and q '
    });
    expect(expression).to.have.property('string', ' p and q ');
  });

  function testExpr(args) {
    var expression = new Expression({string: args.exprString});
    it(args.description, function () {
      // Test each expression against the given permutations of variable
      // values and the expected outputs
      args.testCases.forEach(function (testCase) {
        var actualOutput = expression.evaluate(testCase.varValues);
        expect(actualOutput).to.equal(testCase.output);
      });
    });
  }

  function testExprs(args) {
    // Generate a test for each supplied expression
    args.exprStrings.forEach(function (exprString) {
      testExpr({
        exprString: exprString,
        description: 'should evaluate `' + exprString + '`',
        testCases: args.testCases
      });
    });
  }

  describe('variable name', function () {
    testExpr({
      exprString: 'p',
      description: 'should evaluate a single variable name',
      testCases: [
        {varValues: {p: false}, output: false},
        {varValues: {p: true}, output: true}
      ]
    });
    testExpr({
      exprString: 'P',
      description: 'should be case-sensitive',
      testCases: [
        {varValues: {p: false}, output: null},
        {varValues: {p: true}, output: null}
      ]
    });
  });

  describe('boolean value', function () {
    testExprs({
      exprStrings: ['false', 'FaLsE'],
      testCases: [
        {varValues: {p: false}, output: false},
        {varValues: {p: true}, output: false}
      ]
    });
    testExprs({
      exprStrings: ['true', 'tRuE'],
      testCases: [
        {varValues: {p: false}, output: true},
        {varValues: {p: true}, output: true}
      ]
    });
  });

  describe('NOT operation', function () {
    testExprs({
      exprStrings: ['not p', 'not  p', 'NoT p', '!p', '!  p'],
      testCases: [
        {varValues: {p: false}, output: true},
        {varValues: {p: true}, output: false}
      ]
    });
  });

  describe('AND operation', function () {
    testExprs({
      exprStrings: ['p and q', 'p  and   q', 'p AnD q', 'p&q', 'p  &  q'],
      testCases: [
        {varValues: {p: false, q: false}, output: false},
        {varValues: {p: false, q: true}, output: false},
        {varValues: {p: true, q: false}, output: false},
        {varValues: {p: true, q: true}, output: true},
      ]
    });
  });

  describe('NAND operation', function () {
    testExprs({
      exprStrings: ['p nand q', 'p  nand   q', 'p nAnD q'],
      testCases: [
        {varValues: {p: false, q: false}, output: true},
        {varValues: {p: false, q: true}, output: true},
        {varValues: {p: true, q: false}, output: true},
        {varValues: {p: true, q: true}, output: false},
      ]
    });
  });

  describe('OR operation', function () {
    testExprs({
      exprStrings: ['p or q', 'p  or   q', 'p oR q', 'p|q', 'p  |  q'],
      testCases: [
        {varValues: {p: false, q: false}, output: false},
        {varValues: {p: false, q: true}, output: true},
        {varValues: {p: true, q: false}, output: true},
        {varValues: {p: true, q: true}, output: true},
      ]
    });
  });

  describe('NOR operation', function () {
    testExprs({
      exprStrings: ['p nor q', 'p  nor   q', 'p NoR q'],
      testCases: [
        {varValues: {p: false, q: false}, output: true},
        {varValues: {p: false, q: true}, output: false},
        {varValues: {p: true, q: false}, output: false},
        {varValues: {p: true, q: true}, output: false},
      ]
    });
  });

  describe('XOR operation', function () {
    testExprs({
      exprStrings: ['p xor q', 'p  xor   q', 'p XoR q', 'p^q', 'p  ^  q'],
      testCases: [
        {varValues: {p: false, q: false}, output: false},
        {varValues: {p: false, q: true}, output: true},
        {varValues: {p: true, q: false}, output: true},
        {varValues: {p: true, q: true}, output: false},
      ]
    });
  });

  describe('implication operation', function () {
    testExprs({
      exprStrings: ['p -> q', 'p  ->   q'],
      testCases: [
        {varValues: {p: false, q: false}, output: true},
        {varValues: {p: false, q: true}, output: true},
        {varValues: {p: true, q: false}, output: false},
        {varValues: {p: true, q: true}, output: true},
      ]
    });
  });

  describe('double-implication (XNOR) operation', function () {
    testExprs({
      exprStrings: ['p <-> q', 'p  <->  q', 'p xnor q', 'p  xnor  q', 'p xNoR q'],
      testCases: [
        {varValues: {p: false, q: false}, output: true},
        {varValues: {p: false, q: true}, output: false},
        {varValues: {p: true, q: false}, output: false},
        {varValues: {p: true, q: true}, output: true},
      ]
    });
  });

  describe('parenthesized expression', function () {
    testExprs({
      exprStrings: ['p & (p | !q)'],
      testCases: [
        {varValues: {p: false, q: false}, output: false},
        {varValues: {p: false, q: true}, output: false},
        {varValues: {p: true, q: false}, output: true},
        {varValues: {p: true, q: true}, output: true},
      ]
    });
  });

  testExpr({
    exprString: '  p and q  ',
    description: 'should ignore leading/trailing whitespace',
    testCases: [
        {varValues: {p: false, q: false}, output: false},
        {varValues: {p: false, q: true}, output: false},
        {varValues: {p: true, q: false}, output: false},
        {varValues: {p: true, q: true}, output: true},
    ]
  });

});
