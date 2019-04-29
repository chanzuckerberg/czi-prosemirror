'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var DOM_ATTRIBUTE_PAGE_BREAK = 'data-page-break';

function getAttrs(dom) {
  var attrs = {};
  if (dom.getAttribute(DOM_ATTRIBUTE_PAGE_BREAK) || dom.style.pageBreakBefore === 'always') {
    // Google Doc exports page break as HTML:
    // `<hr style="page-break-before:always;display:none; />`.
    attrs.pageBreak = true;
  }

  return attrs;
}

var HorizontalRuleNode = {
  attrs: {
    pageBreak: { default: null }
  },

  group: 'block',

  parseDOM: [{ tag: 'hr', getAttrs: getAttrs }],

  toDOM: function toDOM(node) {
    var domAttrs = {};
    if (node.attrs.pageBreak) {
      domAttrs[DOM_ATTRIBUTE_PAGE_BREAK] = 'true';
    }
    return ['hr', domAttrs];
  }
};

exports.default = HorizontalRuleNode;