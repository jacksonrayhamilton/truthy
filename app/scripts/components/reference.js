'use strict';

var m = require('mithril');
var classNames = require('classnames');

// The application reference sidebar (listing supported syntax/operations)
var ReferenceComponent = {};

// Reference data for all operations supported by Truthy
ReferenceComponent.features = [
  {
    name: 'NOT',
    examples: ['not p', '!p']
  },
  {
    name: 'AND',
    examples: ['p and q', 'p & q', 'p && q']
  },
  {
    name: 'OR',
    examples: ['p or q', 'p | q', 'p || q']
  },
  {
    name: 'Parentheses',
    examples: ['(p & q) | (p & r)']
  },
  {
    name: 'XOR',
    examples: ['p xor q', 'p ^ q']
  },
  {
    name: 'NOR',
    examples: ['p nor q']
  },
  {
    name: 'NAND',
    examples: ['p nand q']
  },
  {
    name: 'Implication',
    examples: ['p -> q']
  },
  {
    name: 'Double-Implication (XNOR)',
    examples: ['p <-> q', 'p xnor q']
  }
];

ReferenceComponent.view = function (vnode) {
  var referenceIsOpen = vnode.attrs.referenceIsOpen;
  return m('div#reference', {
    class: classNames(
      'reference-close-control',
      {'reference-is-open': referenceIsOpen}
    )
  }, m('#reference-sidebar.scrollable-container', [
      m('img.reference-close-control', {
        src: 'icons/close.svg',
        alt: 'Close'
      }),
      m('h2', 'App Reference'),
      ReferenceComponent.features.map(function (feature) {
        return m('div.feature', [
          m('h3', feature.name),
          feature.examples.map(function (example) {
            return m('pre.feature-example', example);
          })
        ]);
      })
    ])
  );
};

module.exports = ReferenceComponent;
