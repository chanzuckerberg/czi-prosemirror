'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchElementInlineStyles;

var _hyphenize = require('./hyphenize');

var _hyphenize2 = _interopRequireDefault(_hyphenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Ensure that inline-styles can be correctly translated as inline marks.
function patchElementInlineStyles(doc) {
  // Workaround to patch inline styles added to <p /> by google doc.
  var pEls = (0, _from2.default)(doc.querySelectorAll('p[style]'));
  pEls.forEach(patchElement);
}

var NODE_TYPE_TEXT = 3;
var NODE_TYPE_ELEMENT = 1;
var INLINE_STYLE_NAMES = ['backgroundColor', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'textDecoration'];

var INLINE_ELEMENT_NODE_NAMES = new _set2.default(['B', 'EM', 'I', 'SPAN', 'STRONG', 'U']);

function patchElement(el) {
  INLINE_STYLE_NAMES.forEach(function (name) {
    return patchElementStyle(el, name);
  });
}

// Move the specified inline style of the element to its child nodes. This
// assumes that its child nodes are inline elements.
function patchElementStyle(el, inlineStyleName) {
  var element = el;
  var elementStyle = element.style;
  var value = elementStyle && elementStyle[inlineStyleName];
  if (!value) {
    return;
  }

  // Remove the style.
  elementStyle[inlineStyleName] = '';

  var childNodes = (0, _from2.default)(element.childNodes);
  childNodes.forEach(function (node) {
    var nodeType = node.nodeType,
        style = node.style,
        nodeName = node.nodeName,
        ownerDocument = node.ownerDocument,
        parentElement = node.parentElement;


    if (nodeType === NODE_TYPE_ELEMENT) {
      if (INLINE_ELEMENT_NODE_NAMES.has(nodeName)) {
        var cssText = (0, _hyphenize2.default)(inlineStyleName) + ': ' + value + ';' + style.cssText;
        style.cssText = cssText;
      }
    } else if (nodeType === NODE_TYPE_TEXT) {
      if (ownerDocument && parentElement) {
        var span = ownerDocument.createElement('span');
        span.style[inlineStyleName] = value;
        parentElement.insertBefore(span, node);
        span.appendChild(node);
      }
    }
  });
}