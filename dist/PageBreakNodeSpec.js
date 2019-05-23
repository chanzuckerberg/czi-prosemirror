'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var DOM_ATTRIBUTE_PAGE_BREAK = 'data-page-break';

function getAttrs(dom) {
  var attrs = {};
  console.log('PARSEDOM to PageBreak', attrs, dom);
  if (dom.getAttribute(DOM_ATTRIBUTE_PAGE_BREAK)) {
    // Google Doc exports page break as HTML:
    // `<hr style="page-break-before:always;display:none; />`.
    attrs.pageBreak = true;
  }
  return attrs;
}

var PageBreakNodeSpec = {
  attrs: {
    pageBreak: { default: null }
  },
  group: 'block',
  parseDOM: [{ tag: 'hr', getAttrs: getAttrs }],
  toDOM: function toDOM(node) {
    return ['div', {
      DOM_ATTRIBUTE_PAGE_BREAK: true
    }];
  }
};

exports.default = PageBreakNodeSpec;