'use strict';

var _ = require('underscore');
var Collection = require('./collection');
var Variable = require('./variable');

// An ordered sequence of variables; every variable collection inherits from the
// base Collection model
function VariableCollection(args) {
  Collection.call(this, {
    SubCollectionItem: Variable,
    items: args.items
  });
}
VariableCollection.prototype = Object.create(Collection.prototype);

// Return true if a variable with the given name does not exist in the
// collection; otherwise, return false
VariableCollection.prototype.checkNameAvailability = function (variableName) {
  return !_.some(this.items, function (variable) {
    return (variable.name === variableName);
  });
};

// Transform all possible permutations of true/false values for this collection
// of variables using the provided callback
VariableCollection.prototype.mapPermutations = function (callback) {
  var variables = this;
  // An object where each key is a variable name and each value is a boolean
  // representing the current value of that variable
  var currentVarValues = _.object(variables.map(function (variable) {
    // Initialize all variable values to false
    return [variable.name, false];
  }));
  // If n corresponds to the number of variables, then there will always be 2^n
  // permutations to generate
  return _.times(Math.pow(2, variables.length), function (rowIndex) {
    variables.forEach(function (variable, varIndex) {
      // Alternate variable values as needed (but not on the first permutation)
      if (rowIndex % Math.pow(2, variables.length - varIndex - 1) === 0 && rowIndex !== 0) {
        currentVarValues[variable.name] = !currentVarValues[variable.name];
      }
    });
    return callback(currentVarValues);
  });
};

// Get the next available variable name for a new variable (to insert next to
// the given base variable)
VariableCollection.prototype.getNextVariableName = function (baseVariable) {
  // Create a list of variable names already in use
  var variableCharCodes = this.map(function (variable) {
    return variable.name.charCodeAt(0);
  });
  // Look for the next letter that isn't already in use
  var nextVarCharCode = baseVariable.name.charCodeAt(0);
  do {
    nextVarCharCode += 1;
    // Wrap variable name around alphabet if necessary (e.g. 'z' wraps around to
    // 'a')
    if (nextVarCharCode === 91 || nextVarCharCode === 123) {
      nextVarCharCode = nextVarCharCode - 26;
    }
  } while (variableCharCodes.indexOf(nextVarCharCode) !== -1);
  return String.fromCharCode(nextVarCharCode);
};

module.exports = VariableCollection;
