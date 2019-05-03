'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

function getAttrs(dom) {
  var align = dom.getAttribute('data-align') || dom.getAttribute('align');
  if (align) {
    align = /(left|right|center)/.test(align) ? align : null;
  }

  return {
    align: align,
    latex: dom.getAttribute('data-latex') || null
  };
}

var MathNodeSpec = {
  inline: true,
  attrs: {
    align: { default: null },
    latex: { default: '' }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{ tag: 'math[data-latex]', getAttrs: getAttrs }, { tag: 'span[data-latex]', getAttrs: getAttrs }],
  toDOM: function toDOM(node) {
    // Normally, the DOM structure of the math node is rendered by
    // `MathNodeView`. This method is only called when user selects a
    // math node and copies it, which triggers the "serialize to HTML" flow that
    // calles this method.
    var _node$attrs = node.attrs,
        align = _node$attrs.align,
        latex = _node$attrs.latex;

    var domAttrs = {};
    if (align) {
      domAttrs.align = align;
    }
    if (latex) {
      domAttrs['data-latex'] = latex;
    }
    return ['span', domAttrs];
  }
};

exports.default = MathNodeSpec;